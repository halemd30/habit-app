import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import LandingPage from "../../routes/LandingPage/LandingPage";
import LoginPage from "../../routes/LoginPage/LoginPage";
import SignUpPage from "../../routes/SignUpPage/SignUpPage";
import TaskListPage from "../../routes/TaskListPage/TaskListPage";
import CreateTaskPage from "../../routes/CreateTaskPage/CreateTaskPage";
import { Route } from "react-router-dom";
import config from "../../config";
import Context from "../../Context";
import TokenService from "../../token-service";
import "./App.scss";

class App extends React.Component {
  state = {
    tasks: [],
    currentUser: "",
    streak: 0,
  };

  componentDidMount() {
    this.getUserInfo((id) => {
      this.getUserTasks(id, () => {});
    });
    // if (TokenService.getAuthToken()) {
    //   this.getUserInfo(() => {});
    // }
  }

  // credentials: username, password
  login = (credentials) => {
    return fetch(`${config.API_ENDPOINT}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }).then((res) => {
      return res.json();
    });
  };

  postUser = (user) => {
    return fetch(`${config.API_ENDPOINT}/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((res) => {
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json();
    });
  };

  getUserInfo = (cb) => {
    fetch(`${config.API_ENDPOINT}/users`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => res.json())
      .then((currentUser) => {
        this.setState({ currentUser }, cb(currentUser.id));
      });
  };

  getUserTasks = (userId, cb) => {
    return fetch(`${config.API_ENDPOINT}/tasks/${userId}`, {
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => res.json())
      .then((tasks) => {
        this.setState(
          {
            tasks,
          },
          cb
        );
      })
      .catch((err) => console.error(err));
  };

  addTask = (task, cb) => {
    fetch(`${config.API_ENDPOINT}/tasks`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(task),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState(
          {
            tasks: [...this.state.tasks, data],
          },
          cb
        );
      })
      .catch((err) => console.error(err));
  };

  deleteTask = (taskId) => {
    const newTasks = this.state.tasks.filter((task) => task.id !== taskId);

    fetch(`${config.API_ENDPOINT}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw error;
          });
        }
      })
      .then(() => {
        this.setState({
          tasks: newTasks,
        });
      });
  };

  startTask = (taskId) => {
    const date = new Date();
    const taskStart = this.state.tasks.map((task) => {
      if (task.id === taskId) {
        task.start_date = date;
      }
      return task;
    });

    fetch(`${config.API_ENDPOINT}/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
    }).then(() => {
      this.setState({
        tasks: taskStart,
      });
    });
  };

  endTask = (taskId) => {
    const endStart = this.state.tasks.map((task) => {
      if (task.id === taskId) {
        task.end_date = new Date();
      }
      return task;
    });

    fetch(`${config.API_ENDPOINT}/tasks/end/${taskId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
    }).then(() => {
      this.setState({
        tasks: endStart,
      });
    });
  };

  streakCounter = (taskId) => {
    let taskFound = this.state.tasks.find((task) => task.id === taskId);
    taskFound.streak++;

    fetch(`${config.API_ENDPOINT}/tasks/${taskId}/modify`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
    }).then(() => {
      this.setState({
        streak: taskFound.streak,
      });
    });
  };

  resetStreak = (taskId, cb) => {
    fetch(`${config.API_ENDPOINT}/tasks/reset/${taskId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
    }).then(cb);
  };

  renderUserTasks() {
    return <Route path={"/taskList"} component={TaskListPage} />;
  }

  renderLandingPage() {
    return <Route exact path={"/"} component={LandingPage} />;
  }

  // when to use fetch in setState for a callback?
  // startTask = (taskId) => {
  //   this.setState(
  //     {
  //       tasks: this.state.tasks.map((task) => {
  //         if (task.id === taskId) {
  //           task.start_date = new Date();
  //         }
  //         return task;
  //       }),
  //     },
  //     // patch with the id and the key/value that you are changing
  //     () => {
  //       fetch(`${config.API_ENDPOINT}/tasks/${taskId}`, {
  //         method: "PATCH",
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //       });
  //     }
  //   );
  // };

  // endTask = (taskId) => {
  //   this.setState(
  //     {
  //       tasks: this.state.tasks.map((task) => {
  //         if (task.id === taskId) {
  //           task.end_date = new Date();
  //         }
  //         return task;
  //       }),
  //     },
  //     () => {
  //       fetch(`${config.API_ENDPOINT}/tasks/${taskId}`, {
  //         method: "PATCH",
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //       });
  //     }
  //   );
  // };

  render() {
    const contextValue = {
      streak: this.state.streak,
      tasks: this.state.tasks,
      currentUser: this.state.currentUser,
      addTask: this.addTask,
      deleteTask: this.deleteTask,
      getUserTasks: this.getUserTasks,
      postUser: this.postUser,
      login: this.login,
      getUserInfo: this.getUserInfo,
      startTask: this.startTask,
      endTask: this.endTask,
      streakCounter: this.streakCounter,
      resetStreak: this.resetStreak,
    };

    return (
      <Context.Provider value={contextValue}>
        <div className="app">
          <header>
            <Route path="/" component={Header} />
          </header>

          <main className="appMain">
            <Route exact path={"/"} component={LandingPage} />
            <Route path={"/login"} component={LoginPage} />
            <Route path={"/signUp"} component={SignUpPage} />
            <Route path={"/taskList"} component={TaskListPage} />
            <Route path={"/createTask"} component={CreateTaskPage} />
          </main>

          <footer>
            <Footer />
          </footer>
        </div>
      </Context.Provider>
    );
  }
}

export default App;
