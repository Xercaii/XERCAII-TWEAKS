from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import uuid

app = Flask(__name__)
app.secret_key = 'ahsgfhgfafvfhavfhjashfty6753hvqbhfuy7ryh2brhdgjf'  # Replace with a strong secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
db = SQLAlchemy(app)
mail = Mail(app)

# Define a model for storing tokens
class PurchaseToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(36), unique=True, nullable=False)
    product_type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.String(100), nullable=False)  # Replace with actual user identification

@app.route('/api/purchase', methods=['POST'])
def purchase():
    data = request.get_json()
    token = str(uuid.uuid4())
    
    # Save the purchase token to the database
    new_purchase = PurchaseToken(
        token=token,
        product_type=data['productType'],
        user_id=session.get('user_id')  # Assuming user_id is stored in the session
    )
    db.session.add(new_purchase)
    db.session.commit()

    return jsonify({'success': True, 'token': token})

@app.route('/success/<token>')
def success(token):
    # Validate the token
    purchase = PurchaseToken.query.filter_by(token=token).first()
    if purchase:
        # Invalidate the token after use
        db.session.delete(purchase)
        db.session.commit()
        return render_template('success.html', product_type=purchase.product_type)
    return redirect(url_for('shop'))

if __name__ == '__main__':
    app.run(debug=True)