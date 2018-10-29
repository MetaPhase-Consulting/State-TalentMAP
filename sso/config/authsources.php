<?php

$config = array(

    'admin' => array(
        'core:AdminPassword',
    ),

    // use the default group
    'example-userpass' => array(
        'exampleauth:UserPass',

        // Give the user an option to save their username for future login attempts
        // And when enabled, what should the default be, to save the username or not
        //'remember.username.enabled' => FALSE,
        //'remember.username.checked' => FALSE,

        'admin:admin' => array(
            'uid' => array('admin'),
            'EmailAddress' => array('admin@talentmap.us'),
            'eduPersonAffiliation' => array('member', 'admin'),
            'givenname' => array('Admin'),
            'surname' => array('Admin'),
        ),
        'shadtrachl:password' => array(
            'uid' => array('shadtrachl'),
            'EmailAddress' => array('shadtrachl@talentmap.us'),
            'eduPersonAffiliation' => array('member', 'cdo'),
            'givenname' => array('Leah'),
            'surname' => array('Shadtrach'),
        ),
        'townpostj:password' => array(
            'uid' => array('townpostj'),
            'EmailAddress' => array('townpostj@talentmap.us'),
            'eduPersonAffiliation' => array('member', 'bidder'),
            'givenname' => array('Jenny'),
            'surname' => array('Townpost'),
        ),
        'rehmant:password' => array(
            'uid' => array('rehmant'),
            'EmailAddress' => array('rehmant@talentmap.us'),
            'eduPersonAffiliation' => array('member', 'bidder'),
            'givenname' => array('Tarek'),
            'surname' => array('Rehman'),
        ),
        'woodwardw:password' => array(
            'uid' => array('woodwardw'),
            'EmailAddress' => array('woodwardw@talentmap.us'),
            'eduPersonAffiliation' => array('member', 'ao'),
            'givenname' => array('Wendy'),
            'surname' => array('Woodward'),
        ),
    ),

    'talentmap-sp' => array(
        'saml:SP',
        'entityID' => 'http://localhost:3000/talentmap/',
        'idp' => 'http://localhost:8080/simplesaml/saml2/idp/metadata.php',
        'privatekey' => 'server.pem',
        'certificate' => 'server.crt',
    ),

);