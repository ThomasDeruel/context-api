# Context Api

## Introduction

Le "Context" est un moyen de transmettre des données à travers une arborescence de composants sans avoir à transmettre manuellement les props à tous les niveaux. 

## Pourquoi l'utiliser

Cette fonctionnalité permet de partager des données de manière "global" sur note arbre de composants de notre application React. Cela permet entre autre d'éviter la redondance dans notre code.

On peut donc passer un props en profondeur tout en évitant de les passers dans des éléments intermédiaires.

## Création de notre Context : `React.createContext(defaultvalue)`

C'est la méthode pour créer notre Context. Il est bon à savoir que nous devons lui donner n'importe quelle valeur par défaut.

Exemple:

```jsx
const MyFirstContext = React.createContext("a default value");

const MySecondContext = React.createContext({
    name: 'Paul',
    age: 26,
    toggle: () => {},
    //etc.
})

const MySecondContext = React.createContext(null)
```

## Fournir notre Context : `<MyContext.Provider value={/* une valeur */}`

Grâce au Provider (le fournisseur), nous pouvons assigner une valeur , ce qui permet aux composants enfants de consumer le Context et également s'abonner aux modifications de celui-ci, sans faire appel aux props.

Exemple:

```jsx
import React, { Component } from "react";
const MatiereContext = React.createContext("un nom par défault");

class Maison extends Component {
    state = {
        matiere: "brique"
    }
    render() {
        return (
            <div className="maison">
                <MatiereContext.Provider value={this.state.matiere}>
                {/* 
                // Mes composants sont maintenant "abonnés' à mon Context MatiereContext
                // 
                <Mur/>
                <Cheminee/>
                etc.
                */}
                <MatiereContext.Provider/>
            </div>
        )
    }
}
```
Il est bon à savoir qu'avec un Provider, la valeur par défaut est seulement accessible quand un composant ne match aucun Provider au-dessus de lui. *Cela peut-être utile pour tester un composant isoler sans l'envelopper d'un Provider*.

>! *Mise en garde :* Comme le Context utilise une référence d'identité lors du re-rendu, il existe certains pièges qui pourraient déclencher des rendus non intentionnels chez les consommateurs lors du rendu du Provider. Pour éviter se problème, placez la valeur dans le state parent

## Assigner la valeur de notre Context à un composant : `Class.contextType`

Cette propriété nous permet d'assigner notre Context (crée par `React.createContext(defaultvalue)`).
Cela nous laisse donc la possibilité d'assigner la valeur actuelle de notre context en utilisant `this.context`

Exemple:

```jsx
class Mur extends Component {
    render() {
        let matiere = this.context;
        return (
            <div className="mur">
            <p>Mur fait en {matiere}</p>
            </div>
        )
    }
}
Mur.contextType = MatiereContext
```
>! *Bon à savoir :* Nous ne pouvons qu'assigner qu'une seule valeur pour chaque Context, mais il est possible de consomer plusieurs Contexts, nous verrons cela plus tard

## Alternatif plus simple (et léger) le`Context.Consumer`

Ce composant permet de s'abonner aux changements du context. Cela permet de s'abonner à un contexte dans un composant de fonction.
le Consumer est un moyen plus simple de lire nos données fournis par notre Provider ou notre Context.

Par exemple, je souhaite consomer la valeur de mon Provider
```jsx

class Parent extends Component {
    render() {
        return (
            <MyContext.Provider value={"my title"}>
                <Child/>
            </MyContext.Provider>
        )
    }
}
```
Le rendu côté `Child`:

```jsx
import {MyContext} from '../MyContext';
const Child = () => {
    return (
        <MyContext.Consumer>
        
        {value=>(
            // value = "my title"
            // this is my title
            <h1> This is my {value}<h1>
        )}
        </MyContext.Consumer>
    )
}
export default Child;
```
Comme vous pouvez le voir, nous pouvons directement consomer notre Context sans faire appel à une classe et sans instancier le `contextType`

### Petit tips

Nous pouvons accéder à nos valeurs par défault de notre context *si le Consumer ne match aucun Provider*

```jsx
// Je crée mon Context
const userContext = React.createContext(
    {
        name: "Paul",
        age: 26,
        email: 'paul-jz@exemple.com',
    }
);

// Je le consomme

const Header = () => {
    return (
        <div className="header">
            <h1>User account</h1>
            <userContext.Consumer>
            {({name,age,email}) => (
                <ul>
                    <li>username: {name}</li>
                    <li>age: {age}</li>
                    <li>email: {email}</li>
                </ul>
            )}
            </userContext.Consumer>
        </div>
    )
}

export default Header
```

## Niveau hard: Consommer de nombreux Contexts

Il est tout à fait possible de Consommer plusieurs Contexts. Pour que le rendu du Context soit rapide, React a besoin de séparer chaque Consumer en un noeud distinct dans l'arborescence.

Exemple :

```jsx
const UserContext = React.createContext(undefined);

class App extends React.Component {
    render() {
        state = {
            name: 'paul',
            age: 26,
            email: 'paul-jz@exemple.com'
        }

        return (
            <UserContext.Provide value={this.state.name}>
                <UserContext.Provide value={this.state.age}>
                    <UserContext.Provide value={this.state.email}>
                    <Main/>
                    </UserContext.Provide>  
                </UserContext.Provide>  
            </UserContext.Provide>
        )
    }
}

const Main = () => {
    return (
        <header>header</header>
        <MainSection/>
        <footer>footer</footer>
    )
}

const MainSection = () => {
    return (
        <UserContext.Consumer>
        {name => (
          <UserContext.Consumer>
          {age => (
            <UserContext.Consumer>
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
```