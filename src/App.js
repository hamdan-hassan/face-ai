import React, { Component } from "react";
import Particles from "react-tsparticles";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import Loader from "./components/Loader/Loader";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js";
import Rank from "./components/Rank/Rank";
import "./App.css";

const url = "https://facebrain-server.herokuapp.com";

const initialState = {
  input: "",
  noface: false,
  imageUrl: "",
  loading: false,
  box: {},
  route: "signin",
  isSignedIn: localStorage.getItem("isSignedIn") || false,
  user: JSON.parse(localStorage.getItem("user")) || {
    id: 0,
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};
class App extends Component {
  state = initialState;

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
    localStorage.setItem("user", JSON.stringify(this.state.user));
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    if (event.target.files) {
      this.setState({ loading: true });
      const files = Array.from(event.target.files);
      const formData = new FormData();
      files.forEach((file, i) => {
        formData.append(i, file);
      });
      fetch(`${url}/image-upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((images) => {
          this.setState({ input: images[0].url });
          this.setState({ imageUrl: this.state.input });
          this.setState({ loading: false });
        });
    } else {
      this.setState({ input: event.target.value });
    }
    this.setState({ box: [{}] });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    this.setState({ noface: false });
    fetch("https://sleepy-beach-01060.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch("https://sleepy-beach-01060.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => this.setState({ noface: true }));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
      localStorage.removeItem("isSignedIn");
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
      localStorage.setItem("isSignedIn", true);
    }
    this.setState({ route: route });
  };

  render() {
    return (
      <div className='App'>
        <Particles
          className='particles'
          id='tsparticles'
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                bubble: {
                  distance: 400,
                  duration: 2,
                  opacity: 0.8,
                  size: 40,
                },
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: false,
              },
              move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  value_area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                random: true,
                value: 5,
              },
            },
            detectRetina: true,
          }}
        />
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.isSignedIn ? (
          <div>
            <div className='logo-rank'>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
            </div>
            {this.state.loading ? (
              <Loader />
            ) : (
              <>
                <ImageLinkForm
                  input={this.state.input}
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                  onInputClear={this.onInputClear}
                />
                {this.state.input && (
                  <FaceRecognition
                    box={this.state.box}
                    imageUrl={this.state.input}
                  />
                )}
              </>
            )}
          </div>
        ) : this.state.route === "signin" || this.state.route === "signout" ? (
          <Signin
            loadUser={this.loadUser}
            loading={this.state.loading}
            onRouteChange={this.onRouteChange}
            url={url}
          />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
            url={url}
          />
        )}
      </div>
    );
  }
}

export default App;
