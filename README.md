<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![Client Build Status][client-build-shield]][client-build-url]
[![Client Coveralls][coveralls-badge]][coveralls-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/YourPocketBook/pocket-book-client">
    <img src="public/android-chrome-192x192.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Your Pocket Book - Client</h3>

  <p align="center">
    The home of the Your Pocket Book project.
  </p>
  <p align="center">
    <a href="https://github.com/YourPocketBook/pocket-book-client/issues">Report Bug</a>
    ·
    <a href="https://github.com/YourPocketBook/pocket-book-client/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->

## About The Project

[![YourPocketBook Screen Shot][product-screenshot]](https://yourpocketbook.uk/)

The YourPocketBook project aims to provide SJA volunteers with easy access to policies and procedures.

### Built With

- [React](https://reactjs.org/)
- [Create React App](https://create-react-app.dev/)
- [reactstrap](https://reactstrap.github.io/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

You will need node.js to build or work on this site. You can get it
[here](https://nodejs.org/en/). This has been tested using v12.

### Installation

1. Clone the repo

```sh
git clone https://github.com/YourPocketBook/pocket-book-client.git
```

2. Install NPM packages

```sh
npm install
```

### Running Locally

This site is built around Create React App. This comes with a local server that will let you test the site on your own machine.

To work properly, you will need a copy of [the server](https://github.com/YourPocketBook/pocket-book-server) running on your machine as well. Don't forget to follow the setup instructions for the server.

The following command will start the test server:

```sh
npm start
```

You can run the unit tests with the command:

```sh
npm run test
```

By default, only tests that affect files that have changed but not been committed will be run. Follow the prompts to run the rest.

The latest instructions for working with Create React App are [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md), with lots of useful tips on how to set up your work environment.

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/YourPocketBook/pocket-book-client/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**. Take a look at our contributor's guidelines in `CONTRIBUTING.md`.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Tony Richards - [@trichards57](https://twitter.com/trichards57) - tony.richards@sja.org.uk

Project Link: [https://github.com/YourPocketBook/](https://github.com/YourPocketBook/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/YourPocketBook/pocket-book-client?style=flat-square
[contributors-url]: https://github.com/YourPocketBook/pocket-book-client/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/YourPocketBook/pocket-book-client.svg?style=flat-square
[forks-url]: https://github.com/YourPocketBook/pocket-book-client/network/members
[stars-shield]: https://img.shields.io/github/stars/YourPocketBook/pocket-book-client.svg?style=flat-square
[stars-url]: https://github.com/YourPocketBook/pocket-book-client/stargazers
[issues-shield]: https://img.shields.io/github/issues/YourPocketBook/pocket-book-client.svg?style=flat-square
[issues-url]: https://github.com/YourPocketBook/pocket-book-client/issues
[license-shield]: https://img.shields.io/github/license/YourPocketBook/pocket-book-client?style=flat-square
[license-url]: https://github.com/YourPocketBook/pocket-book-client/blob/master/LICENSE
[product-screenshot]: public/screenshot.png
[client-build-shield]: https://img.shields.io/azure-devops/build/trichards57/c1f78647-0dd7-4ee4-bcf0-cfaf2a7591a4/18?style=flat-square
[client-build-url]: https://dev.azure.com/trichards57/PocketBook/_build?definitionId=18
[coveralls-badge]: https://img.shields.io/azure-devops/coverage/trichards57/PocketBook/18/master?style=flat-square
[coveralls-url]: https://dev.azure.com/trichards57/PocketBook/_build?definitionId=18&_a=summary