from flask import Flask, render_template, request, redirect, url_for, session, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import uuid

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a strong secret key
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

@app.route('/success')
def success():
    token = request.args.get('token')
    if not token:
        return abort(403)  # Forbidden if no token is provided
    
    # Validate the token
    purchase = PurchaseToken.query.filter_by(token=token).first()
    if purchase:
        # Invalidate the token after use
        db.session.delete(purchase)
        db.session.commit()
        return render_template('success.html', product_type=purchase.product_type)
    else:
        return abort(403)  # Forbidden for invalid tokens

# new endpoint for validating tokens
@app.route('/api/validate_token', methods=['GET'])
def validate_token():
    token = request.args.get('token')
    if not token:
        return jsonify({'valid': False}), 400  # Bad request if no token is provided
    
    # Check if the token exists in the database
    purchase = PurchaseToken.query.filter_by(token=token).first()
    if purchase:
        return jsonify({'valid': True})
    else:
        return jsonify({'valid': False})
    
# new endpoint for deleting tokens
@app.route('/api/delete_token', methods=['POST'])
def delete_token():
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({'success': False}), 400  # Bad request if no token is provided
    
    # Find and delete the token
    purchase = PurchaseToken.query.filter_by(token=token).first()
    if purchase:
        db.session.delete(purchase)
        db.session.commit()
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})

if __name__ == '__main__':
    app.run(debug=True)