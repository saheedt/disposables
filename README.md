[![CircleCI](https://circleci.com/gh/saheedt/disposables/tree/master.svg?style=shield)](https://circleci.com/gh/saheedt/disposables/tree/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/7b0943dc58647859d310/maintainability)](https://codeclimate.com/github/saheedt/disposables/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7b0943dc58647859d310/test_coverage)](https://codeclimate.com/github/saheedt/disposables/test_coverage)

# Disposables
An instant messaging application purposely designed not to keep / remember any form of data except from those needed for authentication and authorization. All chat data are stored on user's device and it can be cleared out at will.

It is Suitable for disposable/temporary instant messaging.

NOTE: The application is still in active development phase and still lacks some basic features, like a sign out option, alot of those features will be added imminently.
Features like video and voice call using WebRTC will also be added.

### Deployed App
[Staging](https://disposables-staging.herokuapp.com/)

### Installation

* Navigate to a directory on your machine using your favourite terminal / command line application
* Clone this repository into that directory
  - Using SSH: ```git clone git@github.com:saheedt/disposables.git```
  - Using HTTP: ```git clone https://github.com/saheedt/disposables.git```
* Navigate to the repository's directory
    - `cd disposables`
* Install the app's dependencies
    - `npm install`
* Run application
    - In Devlopment: `npm run dev`
    - In Production: `npm start`

### Testing
*NOTE:* Please checkout the `test` branch or currently opened pull request as tests and CI are worked on.
Testing Socket.io has been interesting (read as weird) so far.

 Run `npm run test` to start automated test.

### Technologies Used
- [Node](nodejs.org)
- [ExpressJS](expressjs.com)
- [React](reactjs.org)
- [Typescript](typescriptlang.org)
- [Socket.io](socket.io)
- [Redis](redis.io)
- [MongoDB](mongodb.com)
- RxJS
- Jasmine
