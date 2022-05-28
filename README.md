# Eleventy-test-bed


## What is this ?

[![Netlify Status](https://api.netlify.com/api/v1/badges/f99d6c1e-032f-4a47-9913-f703cb725c03/deploy-status)](https://app.netlify.com/sites/eleventy-test-bed-dollplayer2501/deploys)


[Demo site (Eleventy test bed)](https://eleventy-test-bed-dollplayer2501.netlify.app/)


This is not something that can be used in a production environment as it is.  
I made this to see the functionality of Eleventy.  
What I can say for sure is "I made it because I need it, and I published it on GitHub".  
By the way, I'm not good at Javascript.

Below, Japanese translation.

> これは、このままで本番環境で利用できる物ではありません。  
> 私は、Eleventyの機能を確認するため、これを作りました。  
> 確実に言えるのは、「私がこれを必要とするので作った、そしてGitHubに公開した」になります。  
> ちなみに私はJavascriptが苦手です。


## Getting started

    git clone git@github.com:dollplayer2501/Eleventy-test-bed.gitt any-path-name
    cd any-path-name

	# If needed
    nvm use

    npm install

    #
    # 1. Local
    #   Data is stored in ./any-path-name/_develop
    #
    npm run develop:watch
    # http://localhost:8080

    # 2. Production
    #   Data is stored in ./any-path-name/_production
    #   HTML is compressed
    #
    npm run product:build
    # If you want to check production's data
    npm run product:serve
    # http://localhost:3000


## Implemented Eleventy's functions

Mainly implements the following functions.

- [Shortcodes](https://www.11ty.dev/docs/shortcodes/)
- [Filters](https://www.11ty.dev/docs/filters/)
- [Nunjucks](https://www.11ty.dev/docs/languages/nunjucks/)
- [Markdown](https://www.11ty.dev/docs/languages/markdown/) via [markdown-it](https://www.npmjs.com/package/markdown-it)
- [Passthrough File Copy](https://www.11ty.dev/docs/copy/)
- [Directory output plugin](https://www.11ty.dev/docs/plugins/directory-output/)
- Top and 404 page, and one more page
- Separation between local environment and production environment  
Specifically, isolation of the output directory and compression of HTML only in the production environment.

The following **mainly** functions are not implemented.

- [Collections (using tags)](https://www.11ty.dev/docs/collections/)  
but I use [Custom filtering and sorting](https://www.11ty.dev/docs/collections/#advanced-custom-filtering-and-sorting).
- [Pagination](https://www.11ty.dev/docs/pagination/)
- [Navigation plugin](https://www.11ty.dev/docs/plugins/navigation/)
- [Image plugin](https://www.11ty.dev/docs/plugins/image/)
- Compiling the CSS preprocessor, for example Sass, SCSS  
I use [Pico.css](https://picocss.com/)'s [Basic template](https://picocss.com/examples/basic-template/).
- Javascript bundles and transpiles

Below, I'm not familiar with it, but I'm implementing it.

- [Transform](https://www.11ty.dev/docs/config/#transforms)  
I use it, but I don't know the details.
- `.editorconfig`, `.jsbeautifyrc`


## Real intention / 本音の部分

I wanted to see how Eleventy's navigation and image plugins behave. So I was building the minimal Eleventy I needed. In the meantime, I thought it would be interesting to make this publicly available.  
This is the real intention.

> 私は、Eleventyのナビゲーションプラグインとイメージプラグインの挙動を確認したいと思いました。そのため、私は、私が必要とする最小限のEleventyを構築していました。その最中、私は、これを広く公開するのも面白そうだ、と思いました。  
> これが本音です。

There is a discrepancy in the implementation, I made this after building the following site, but for reference, the following URL is the site using Eleventy that I operate.

> 実装に齟齬がある、下記のサイトの構築後にこれを作った、になりますが、参考までに、下記URLは、私が運用しているEleventyを使用したサイトになります。

- Site URL: [unlimited text works, the 4th.](https://dollplayer2501.netlify.app/)
- Source code: [dollplayer2501/Eleventy-netlify-V2: Eleventy with Laravel Mix, Gulp](https://github.com/dollplayer2501/Eleventy-netlify-V2)






//
