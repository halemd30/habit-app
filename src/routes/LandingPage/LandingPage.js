import React from "react";
import "./LandingPage.scss";

// if user has token then redirect to main goals page
// if not nothing and stay on landing page

class LandingPage extends React.Component {
  render() {
    return (
      <main className="landingPageMain">
        <section>
          <h1>Lets Get Started!</h1>
          <div>
            <h3>Start forming better habits</h3>
            <p>
              Uforia will help you form better daily habits that will eventually
              lead to a healthier and more fulfilling lifestyle!
            </p>
          </div>
          <div>
            <h3>Build a list of goals to accomplish every day</h3>
            <p>
              You will start living a more fulfilling lifestyle by creating a
              list of dialy goals to accomplish for a consistent period of time,
              typically about 60 days. If you're having trouble coming up with a
              complete list of goals to accomplish there are suggestions and
              resources at the bottom of this page.
            </p>
          </div>
          <div>
            <h3>Accountability</h3>
            <p>
              Uforia keeps track of your progress and holds you accountable to
              complete each goal that you have set out to accomplish every day.
              If you don't complete a goal in your "current goals" section it
              will get placed back in your "goals queue" and you will need to
              start that goal over again. You will be held accountable until you
              complete a goal every day for 60 consecutive days, at which point
              it becomes a habit.
            </p>
          </div>
        </section>
      </main>
    );
  }
}

export default LandingPage;
