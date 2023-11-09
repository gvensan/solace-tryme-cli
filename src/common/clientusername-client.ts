import { Logger } from '../utils/logger'

export class SempClient {
  options:any = null;
  session:any = { hello: 1};
  sempBody:any = {};
  sempAuth:any = null;

  constructor(options:any) {
    // record the options
    this.options = options;

    // work on subscription support
    this.sempAuth = {
      username: this.options?.sempUsername,
      password: this.options?.sempPassword
    }
  }

  /**
   * Asynchronous function that connects to the Solace Broker using SEMP, and returns a promise.
   */
  async manageClientUsername() {
    let sempUrl = this.options.sempUrl;
    switch (this.options.operation.toUpperCase()) {
      case 'CREATE': sempUrl += `/SEMP/v2/config/msgVpns/${this.options.sempVpn}/clientUsernames`; break;
      case 'UPDATE': sempUrl += `/SEMP/v2/config/msgVpns/${this.options.sempVpn}/clientUsernames/${this.options.clientUsername}`; break;
      case 'DELETE': sempUrl += `/SEMP/v2/config/msgVpns/${this.options.sempVpn}/clientUsernames/${this.options.clientUsername}`; break;
    }

    this.sempBody = {            
      msgVpnName: this.options?.sempVpn,
      clientUsername: this.options?.clientUsername,
      aclProfileName: this.options?.aclProfile,
      clientProfileName: this.options?.clientProfile,
      enabled: this.options?.enabled,
      password: this.options?.clientPassword,
    }
  
    if (this.options.operation.toUpperCase() === 'CREATE') {
      await fetch(sempUrl, {
        method: "POST",
        credentials: 'same-origin',
        cache: 'no-cache',
        mode: "cors",      
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': 'Basic ' + btoa(this.options?.sempUsername + ":" + this.options?.sempPassword)
        },
        body: JSON.stringify(this.sempBody)
      })
      .then(async (response) => {
        const data = await response.json();
        if (data.meta.error) {
          Logger.logDetailedError(`client-username '${this.options?.clientUsername}' creation failed with error`, `${data.meta.error.description.split('Problem with POST: ').pop()}`)
          Logger.error('exiting...')
          process.exit(1)
        } else {
          Logger.logSuccess(`client-username '${this.options?.clientUsername}' created successfully`)
        }
      })
      .catch((error) => {
        Logger.logDetailedError(`client-username '${this.options?.clientUsername}' creation failed with error`, `${error.toString()}`)
        if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
        throw error;
      });
    }
    if (this.options.operation.toUpperCase() === 'UPDATE') {
      await fetch(sempUrl, {
        method: "PATCH",
        credentials: 'same-origin',
        cache: 'no-cache',
        mode: "cors",      
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': 'Basic ' + btoa(this.options?.sempUsername + ":" + this.options?.sempPassword)
        },
        body: JSON.stringify(this.sempBody)
      })
      .then(async (response) => {
        const data = await response.json();
        if (data.meta.error) {
          Logger.logDetailedError(`client-username '${this.options?.clientUsername}' update failed with error`, `${data.meta.error.description}`)
          Logger.error('exiting...')
          process.exit(1)
        } else {
          Logger.logSuccess(`client-username '${this.options?.clientUsername}' updated successfully`)
        }
      })
      .catch((error) => {
        Logger.logDetailedError(`client-username '${this.options?.clientUsername}' update failed with error`, `${error.toString()}`)
        if (error.cause?.message) Logger.error(`${error.cause?.message}`)
        throw error;
      });
    }
    if (this.options.operation.toUpperCase() === 'DELETE') {
      await fetch(sempUrl, {
        method: "DELETE",
        credentials: 'same-origin',
        cache: 'no-cache',
        mode: "cors",      
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': 'Basic ' + btoa(this.options?.sempUsername + ":" + this.options?.sempPassword)
        },
      })
      .then(async (response) => {
        const data = await response.json();
        if (data.meta.error) {
          Logger.logDetailedError(`client-username '${this.options?.clientUsername}' delete failed with error`, `${data.meta.error.description}`)
          Logger.error('exiting...')
          process.exit(1)
        } else {
          Logger.logSuccess(`client-username '${this.options?.clientUsername}' deleted successfully`)
        }
      })
      .catch((error) => {
        Logger.logDetailedError(`client-username '${this.options?.clientUsername}' delete failed with error`, `${error.toString()}`)
        if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
        throw error;
      });
    }
  }
}