## Contents
- [NextJs](#NextJs)


## NextJs

in order to allow webassembly in Next.js open your ```next.config.js```

and ad add the following

```js
module.exports = {

    /*... your next.js config ...*/

    // allows *.wasm files
    webpack: (config) => {
        const experiments = config.experiments || {};
        config.experiments = {
        ...experiments,
        syncWebAssembly: true,
        };
        return config
    },
};
```