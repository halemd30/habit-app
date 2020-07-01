import React from "react";
import Context from "../../Context";
import TokenService from "../../token-service";

export default class LoginPage extends React.Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
    handleLoginSuccess: () => {},
  };

  static contextType = Context;

  state = { error: null };

  handleLoginSuccess = () => {
    // console.log("location prop", this.props.location);
    // const { location, history } = this.props;
    // const destination = (location.state || {}).from || "/";
    this.context.getUserInfo((id) => {
      this.context.getUserTasks(id, () => {
        console.log("user tasks", this.context.tasks);
        this.props.history.push(`/taskList`);
      });
    });
  };

  handleSubmitJwtAuth = (ev) => {
    ev.preventDefault();
    this.setState({ error: null });
    const { username, password } = ev.target;

    this.context
      .login({
        username: username.value,
        password: password.value,
      })
      .then((res) => {
        TokenService.saveAuthToken(res.authToken);
        this.handleLoginSuccess();
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  render() {
    return (
      <main className="loginMain signUpMain">
        <form
          className="signUpForm loginForm"
          onSubmit={this.handleSubmitJwtAuth}
        >
          <h2>Login</h2>

          <div className="username">
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              id="username" //value="halemd30"
            />
          </div>

          <div className="password">
            <label htmlFor="password">Password:</label>
            <input
              name="password"
              id="password"
              type="password"
              //value="Cravath87"
            />
          </div>

          <button type="submit" className="submit">
            Submit
          </button>
        </form>
      </main>
    );
  }
}
