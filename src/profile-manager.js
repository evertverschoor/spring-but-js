function ProfileManager(_logger) {

    const logger = _logger;

    let currentProfile;

    this.parseCommandLineArguments = parseCommandLineArguments;
    this.isCurrentProfile = isCurrentProfile;
    this.setProfile = setProfile;

    function parseCommandLineArguments(args) {
        if(args.length > 2) {
            args.forEach(arg => {
                if(arg.indexOf('--profile=') == 0) {
                    currentProfile = arg.replace('--profile=', '');
                }
            });
        }

        if(currentProfile != null) {
            logger.info('Using profile "' + currentProfile + '".');
        } else {
            logger.info('No profile detected, using default.');
        }
    }

    function isCurrentProfile(profile) {
        return currentProfile != null && currentProfile == profile;
    }

    function setProfile(profile) {
        if(currentProfile == null) {
            currentProfile = profile;
        } else {
            logger.error('The profile cannot be set more than once!');
        }
    }
}

module.exports = ProfileManager;