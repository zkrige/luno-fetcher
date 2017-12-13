const FileDatastore = require('./FileDatastore')
const FirebaseDatastore = require('./FirebaseDatastore')

class DatastoreFactory {
    static getDatastore(isLive) {
        if (isLive) {
            return new FirebaseDatastore()
        } else {
            return new FileDatastore()
        }
    }
}

module.exports = DatastoreFactory