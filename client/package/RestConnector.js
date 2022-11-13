import axios from 'axios';
import getConfig from 'next/config';
import * as RestConnector from '../connectors/RestConnector'
import  AccountGateway  from './account/gateways/AccountGateway';
import  AccountService  from './account/services/AccountService';
import DocumentGateway from './document/gateways/DocumentGateway';
import DocumentService from './document/services/DocumentService';

const { publicRuntimeConfig } = getConfig()
const API_BASE_URL = publicRuntimeConfig.BASE_API_URL

const restConnector = RestConnector.create({ baseUrl: API_BASE_URL })

const accountGateway = new AccountGateway({restConnector});
const documentGateway = new DocumentGateway({restConnector})

export const accountService = new AccountService({accountGateway});
export const documentService = new DocumentService({documentGateway})