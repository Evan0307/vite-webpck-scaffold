import path from 'path';
import stringHash from 'string-hash';
import { defineConfig, loadEnv } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import svgrPlugin from 'vite-plugin-svgr';
import reactJsx from 'vite-react-jsx';

import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    resolve: {
      alias: [
        { find: /^~/, replacement: '' },
        { find: '@', replacement: '/src' },
      ],
    },
    envPrefix: ['VITE_',],
    define: {
      VITE_NODE_ENV: JSON.stringify('development'),
    },
    plugins: [
      reactJsx(),
      reactRefresh(),
      svgrPlugin(),
      vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style: (name) => {
              if (name === 'col' || name === 'row') {
                return 'antd/lib/style/index.less';
              }
              return `antd/es/${name}/style/index.less`;
            },
          },
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // modifyVars: themeVariables,
        },
        scss: {},
      },
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: function (name, filename, css) {
          const file = path.basename(filename, '.scss');
          if (file === 'theme-define.module') {
            return name;
          }
          const i = css.indexOf(`.${name}`);
          const lineNumber = css.substr(0, i).split(/[\r\n]/).length;
          const hash = stringHash(css).toString(36).substr(0, 5);
          return `_${name}_${hash}_${lineNumber}`;
        },
      },
    },
    server: {
      port: 3030,
      proxy: {
        '/api': {
          target: 'http://localhost:7001',
          changeOrigin: true,
        },
       
      },
    },
  });
};
