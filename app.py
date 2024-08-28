from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import uuid

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a strong secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
db = SQLAlchemy(app)
mail = Mail(app)

# Define a model for storing tokens
class Token(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(36), unique=True, nullable=False)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Handle user signup
        token = str(uuid.uuid4())
        new_token = Token(token=token)
        db.session.add(new_token)
        db.session.commit()
        
        # Send confirmation email
        msg = Message('Signup Successful', recipients=[request.form['email']])
        msg.body = f"Your signup was successful. Access your page at: {url_for('success', token=token, _external=True)}"
        mail.send(msg)
        
        return redirect(url_for('success', token=token))
    return render_template('signup.html')

@app.route('/success/<token>')
def success(token):
    # Validate the token
    token_record = Token.query.filter_by(token=token).first()
    if token_record:
        # Invalidate the token after use
        db.session.delete(token_record)
        db.session.commit()
        return render_template('success.html')
    return redirect(url_for('signup'))

if __name__ == '__main__':
    app.run(debug=True)