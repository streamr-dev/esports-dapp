require('dotenv').config()

const baseUrl = process.env.REACT_APP_BACKEND_BASEURL
const betFactoryAddress = process.env.REACT_APP_BETFACTORY_ADDRESS
const ethUrl = process.env.REACT_APP_ETH_URL

export default {baseUrl, betFactoryAddress, ethUrl}