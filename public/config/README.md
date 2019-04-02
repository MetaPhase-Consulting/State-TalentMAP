# Feature Flag Config

### Using this configuration file
In order to conditionally render content without rebuilding the application, the contained `config.json` file can be used to configure which content is displayed or hidden. The rules can be configured globally and by user property.

### Structure
The `config.json` file must be valid JSON (no trailing commas, no comments, etc). Comments below have only been added to describe functionality.

```js
{
  // configure a custom API URL
  "api_url": "https://api.dev.talentmap.com/api/v1/",
  
  // global rules set to true/false
  "flags": {
    "bidding": false,
    "projected_vacancy": false,
    "static_content": false
  },
  
  // overrides "flags" by user property
  "flags_overrides": [
    {
      "flag": "bidding", // override the bidding property
      "override": true, // the value to override with
      "property": "grade", // the user property to check
      "value": "02", // the value it must be
      "order": 100 // ascending order in which to run rules
    },
    {
      "flag": "bidding",
      "override": false,
      "property": "id",
      "value": 50",
      "order": 200 // order is important - this will have precedence over a lower order
    },
    {
      "flag": "projected_vacancy",
      "override": false,
      "property": "permission_groups",
      "value": ["admin", "bidcycle_admin"], // user must have at least one of these roles
      "order": 300
    }
  ]
}
```

### User Profile Object
The user profile object on the front-end is a combination of `GET /profile/` and `GET /permission/user/`, i.e.

```js
{
  ...profile,
  permission_groups: ['perm1', 'perm2', ...]
}
```

### Rendering
The front-end uses the [flags](https://github.com/garbles/flag) library to conditionally render content, based on a mapping of the user's profile object against `config.json`.

### Caveats
- If `config.json` does not exist or is not valid JSON, all rules will be set to false.
- This currently only works for user profile fields that are numbers, strings, or an array of numbers or strings.