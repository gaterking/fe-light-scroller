import VuePlugin from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

const isProd = process.env.NODE_ENV === 'production';
export default {
    input: 'src/index.js',
    output: {
        dir: 'dist',
        file: isProd ? 'fe-light-scroller.min.js' : 'fe-light-scroller.js',
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
        (isProd && uglify({
            compress: {
                drop_console: true,
            },
        })),
    ],
};
