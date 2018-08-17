convict.addParser({ extension: 'toml', parse: toml.parse });
convict.addParser({ extension: ['yml', 'yaml'], parse: yaml.safeLoad });
convict.addParser([
   { extension: 'json', parse: JSON.parse },
   { extension: 'json5', parse: json5.parse },
   { extension: ['yml', 'yaml'], parse: yaml.safeLoad },
   { extension: 'toml', parse: toml.parse }
]);

const config = convict({ ... });
config.loadFile('config.toml');