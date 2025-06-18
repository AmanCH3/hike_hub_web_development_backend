import React from 'react';
const NavigationContext = React.createContext();
const CallToActionSection = () => {
    return (
        <section className="bg-green-700">
            <div className="container mx-auto px-6 py-16 text-center text-white">
                <h2 className="text-3xl font-bold mb-2">Get 20% Off Your First Order!</h2>
                <p className="text-lg text-green-100 mb-6">Sign up now and get exclusive offers delivered to your inbox.</p>
                <button className="bg-white text-green-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-green-100 transition-colors duration-300 transform hover:scale-105">
                    Sign Up Now
                </button>
            </div>
        </section>
    );
};

export default CallToActionSection;
export { NavigationContext, CallToActionSection };