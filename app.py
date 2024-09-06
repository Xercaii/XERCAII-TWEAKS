from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import uuid
import hashlib

app = Flask(__name__)
app.secret_key = 'ahsgfhgfafvfhavfhjashfty6753hvqbhfuy7ryh2brhdgjf'  # Replace with a strong secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
db = SQLAlchemy(app)
mail = Mail(app)

# Define your models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class PurchaseToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(36), unique=True, nullable=False)
    product_type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('purchases', lazy=True))

# Define your routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = hashlib.sha256(request.form['password'].encode()).hexdigest()
        user = User.query.filter_by(email=email, password=password).first()
        if user:
            session['user_id'] = user.id
            return redirect(url_for('account'))
        else:
            return 'Invalid credentials'
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = hashlib.sha256(request.form['password'].encode()).hexdigest()
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/account')
def account():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user = User.query.get(session['user_id'])
    return render_template('account.html', user=user)

@app.route('/api/purchase', methods=['POST'])
def purchase():
    data = request.get_json()
    token = str(uuid.uuid4())
    new_purchase = PurchaseToken(
        token=token,
        product_type=data['productType'],
        user_id=session.get('user_id')
    )
    db.session.add(new_purchase)
    db.session.commit()
    return jsonify({'success': True, 'token': token})

@app.route('/success/<token>')
def success(token):
    purchase = PurchaseToken.query.filter_by(token=token).first()
    if purchase:
        db.session.delete(purchase)
        db.session.commit()
        return render_template('success.html', product_type=purchase.product_type)
    return redirect(url_for('shop'))

if __name__ == '__main__':
    db.create_all()  # Create database tables
    app.run(debug=True)