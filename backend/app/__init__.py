from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Import blueprints
    from app.routes import properties
    from app.routes.simulation_routes import simulation_bp
    from app.routes.taxcalc_routes import taxcalc_bp
    #from app.routes.portfolio_routes import portfolio_bp

    # Register blueprints
    app.register_blueprint(properties.bp)
    app.register_blueprint(simulation_bp, url_prefix='/api/simulation')
    app.register_blueprint(taxcalc_bp, url_prefix='/api/tax-calc')
    #app.register_blueprint(portfolio_bp, url_prefix='/api/portfolio')

    return app
