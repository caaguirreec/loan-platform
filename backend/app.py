from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///loans.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    term = db.Column(db.Integer, nullable=False)  # Term in days
    status = db.Column(db.String(20), default="pending")  # pending, approved, denied
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'employee_name': self.employee_name,
            'amount': self.amount,
            'term': self.term,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

@app.route('/api/loans', methods=['GET'])
def get_loans():
    loans = Loan.query.all()
    return jsonify([loan.to_dict() for loan in loans])

@app.route('/api/loans', methods=['POST'])
def create_loan():
    data = request.json
    
    # Validate input
    if not all(key in data for key in ['employee_name', 'amount', 'term']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        amount = float(data['amount'])
        term = int(data['term'])
        
        if amount <= 0 or term <= 0:
            return jsonify({'error': 'Amount and term must be positive'}), 400
            
        new_loan = Loan(
            employee_name=data['employee_name'],
            amount=amount,
            term=term
        )
        
        db.session.add(new_loan)
        db.session.commit()
        
        return jsonify(new_loan.to_dict()), 201
    except ValueError:
        return jsonify({'error': 'Invalid amount or term format'}), 400

@app.route('/api/loans/<int:loan_id>', methods=['PUT'])
def update_loan_status(loan_id):
    data = request.json
    
    if 'status' not in data or data['status'] not in ['approved', 'denied']:
        return jsonify({'error': 'Invalid status'}), 400
    
    loan = Loan.query.get(loan_id)
    
    if not loan:
        return jsonify({'error': 'Loan not found'}), 404
    
    loan.status = data['status']
    db.session.commit()
    
    return jsonify(loan.to_dict())

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

# Create tables and run the app
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 