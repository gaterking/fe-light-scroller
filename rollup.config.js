import VuePlugin from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    output: {
        dir: 'dist',
        file: 'bundle.js',
        format: 'umd',
        name: 'fe-light-scroller',
    },
    plugins: [
        resolve(),
        commonjs(),
        VuePlugin(/* VuePluginOptions */),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
        }),
    ],
};
