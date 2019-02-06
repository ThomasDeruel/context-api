import React, { Component } from 'react';
import './App.css';

// je crée mon Context, j'assigne comme valeur par défaut "undefinied"
// une valeur par défaut est obligatoire, dans notre cas on ne consommera jamais cette valeur, d'où le "undefined"

const UserContext = React.createContext(undefined);

class App extends Component {
  state = {
    name: 'paul',
    age: 26,
    email: 'paul-jz@exemple.com'
  }
    render() {
        return (
          <div className="App">
           {/*Première étape: je fournis mes valeurs dans des noeuds
             premier niveau: je fournis age*/}
            <UserContext.Provider value={this.state.name}>
              {/* deuxième niveau: je fournis age*/}
              <UserContext.Provider value={this.state.age}>
                {/* troisième niveau: je fournis email*/}
                <UserContext.Provider value={this.state.email}>
                  <Main/>
                </UserContext.Provider>  
              </UserContext.Provider>  
            </UserContext.Provider>
          </div>
        )
    }
}

/* Composant principal - chemin intermédiaire */
const Main = () => {
    return (
        <div>
        <header>header</header>
        {/* aucun props assigné*/}
        <MainSection/>
        <footer>footer</footer>
        </div>
    )
}
/* Section principale */
const MainSection = () => {
    return (
        /* deuxième étape: je consomme mon Context */
        <UserContext.Consumer>
        {/* premier niveau, je récupère name*/}
        {name => (
          <UserContext.Consumer>
            {/* deuxième niveau, je récupère age */}
          {age => (
            <UserContext.Consumer>
              {/* troisième niveau, je récupère email*/}
            {email => (
                <Profil name={name} age={age} email={email}/>
            )}
            </UserContext.Consumer>
          )}
          </UserContext.Consumer>
        )}
        </UserContext.Consumer>
    )
};

/* Profil de l'user*/

const Profil = ({name, age, email}) => {
    return (
        <ul>
            <li>username: {name}</li>
            <li>age: {age}</li>
            <li>email: {email}</li>
        </ul>
    )
}

export default App;