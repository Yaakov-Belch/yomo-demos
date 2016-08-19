# Yomo demos

Test this on your computer:

    git clone https://github.com/Yaakov-Belch/yomo-demos.git
    cd yomo-demos
    npm install
    npm run demos  # ignore warnings!

    ... Once you see the big MOSCA logo ===>
    ... visit ===> http://localhost:8080/

## Harmless compiler warning

As of writing this, the browserify plungin `factor-bundle`
creates a harmless warning:

    (node) warning: possible EventEmitter memory leak detected.
    11 finish listeners added.
    Use emitter.setMaxListeners() to increase limit.
    ... a long stack trace follows ...

This bug is reported [here](https://github.com/substack/factor-bundle/issues/64)
with a [pull request](https://github.com/substack/factor-bundle/pull/87).

You can safely ignore this warning.  Hopefully, by the time
you read this, the pull request will have been applied (or
the bug be fixed in some other way).
