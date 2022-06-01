# Eleventy-test-bed


## What is this ?

[![Netlify Status](https://api.netlify.com/api/v1/badges/f99d6c1e-032f-4a47-9913-f703cb725c03/deploy-status)](https://app.netlify.com/sites/eleventy-test-bed-dollplayer2501/deploys)


[Demo site (Eleventy test bed)](https://eleventy-test-bed-dollplayer2501.netlify.app/)


This is not something that can be used in a production environment as it is.
I made this to see the functionality of Eleventy.
What I can say for sure is "I made it because I need it, and I published it on GitHub".  
By the way, I'm not good at Javascript.


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
- Implementation of unique sort order described later

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


## The concept of sorting articles that I implemented

- Articles are sorted by the program internally without using Eleventy's tag, navigation plug-ins, file dates or `date`.
- At a minimum, `order` should be aligned at the same level and|or same path.
- You can understand the behavior by comparing the *.md file in `./source/contents/` that I store with the generated HTML file.
- The implementation is implemented in `./source/_config/eleventy.filters.js` as a Filter for Eleventy.
- This idea and implementation may be an act that eliminates the benefits of Eleventy, but I don't know.

|Path & file name|URL|Order|In-program<br />sort order|
|:---|:---|---:|:---|
|`/home.md`|`/index.html`|50|`__50`|
|`/404.md`|`/404.html`|40|`__40`|
|`/test01.md`|`/test01/index.html`|11|`__11`|
|~~`/test02.md`~~|~~`/test02.html`~~<br />This pattern is not allowed.<br />**`/foo/..../bar/index.html`** is allowed.<br />**`/foo/..../bar.html`** is not allowed|~~12~~|~~`__12`~~|
|`/parent01/index.md`|`/parent01/index.html`|20|`__20`|
|`/parent01/child01/index.md`|`/parent01/child01/index.html`|1|`__20___1`|
|`/parent01/child01/grandchild01.md`|`/parent01/child01/grandchild01/index.html`|100|`__20___2_100`|
|`/parent01/child01/grandchild02.md`|`/parent01/child01/grandchild02/index.html`|200|`__20___2_200`|
|`/parent01/child02/index.md`|`/parent01/child02/index.html`|2|`__20___2`|
|`/parent01/child02/grandchild01/index.md`|`/parent01/child02/grandchild01/index.html`|1|`__20___2___1`|
|`/parent01/child02/grandchild02/index.md`|`/parent01/child02/grandchild02/index.html`|2|`__20___2___2`|
|`/parent01/child03/index.md`|`/parent01/child03/index.html`|3|`__20___3`|
|`/parent02/index.md`|`/parent02/index.html`|30|`__30`|
|`/parent02/child01.md`|`/parent02/child01/index.html`|1|`__30___1`|
|`/parent02/child02.md`|`/parent02/child02/index.html`|2|`__30___2`|

- Path & file name  
Path and file name stored on the local PC
- URL  
`URL` described in *.md file
- Order  
This system-specific sort order that Eleventy does not have. Describe in *.md file.
- In-program sort order  
Eleventy's Filter feature decomposes paths and file names to create your own sort string.
Character string sorting is performed using this character string as a key.
Inside the program, sprintf-js is used instead of "_", and spaces are used, which is 12 digits.


## Real intention

I wanted to see how Eleventy's navigation and image plugins behave. So I was building the minimal Eleventy I needed. In the meantime, I thought it would be interesting to make this publicly available.  
This is the real intention.

There is a discrepancy in the implementation, I made this after building the following site, but for reference, the following URL is the site using Eleventy that I operate.

- Site URL: [unlimited text works, the 4th.](https://dollplayer2501.netlify.app/)
- Source code: [dollplayer2501/Eleventy-netlify-V2: Eleventy with Laravel Mix, Gulp](https://github.com/dollplayer2501/Eleventy-netlify-V2)



- - -



Below, Japanese translation.


## これは何？

これは、このままで本番環境で利用できる物ではありません。
私は、Eleventyの機能を確認するため、これを作りました。
確実に言えるのは、「私がこれを必要とするので作った、そしてGitHubに公開した」になります。  
ちなみに私はJavascriptが苦手です。


## 私が実装した、記事群のソートの概念

- 記事群のソートは、Eleventyのタグやナビゲーションプラグインやファイル日付や日付を使わず、プログラム内部で独自のソート処理を行なっています。
- 最低限、同じレベルでソート順を合わせる必要があります。
- 私が格納している`./source/contents/`内の*.mdファイルと、生成されるHTMLファイルを見比べれば、挙動が理解できると思います。
- 実装はEleventyのFilterとして、`./source/_config/eleventy.filters.js` に実装しています。
- この考え方と実装は、Eleventyの利点を消す行為かもしれませんが、私には分かりません。

&nbsp;

- Path & file name  
ローカルPCに格納されているパスとファイル名。
- URL  
*.mdファイルに記述するURL。
- Order  
Eleventyの機能には無い、このシステム独自のソート順。
*.mdファイルに記述する。
- In-program sort order  
EleventyのFilter機能で、パスとファイル名を分解し、独自のソート文字列を作成している。
Filterで、パスとファイル名を分解し、独自のソート文字列を作成している。
この文字列をキーとして、文字列ソートを行なっている。
プログラム内部は、「_」ではなく、sprintf-jsを使用して、スペースを使用しており、12桁である。


## 本音

私は、Eleventyのナビゲーションプラグインとイメージプラグインの挙動を確認したいと思いました。
そのため、私は、私が必要とする最小限のEleventyを構築していました。
その最中、私は、これを広く公開するのも面白そうだ、と思いました。  
これが本音です。

実装に齟齬がある、下記のサイトの構築後にこれを作った、になりますが、参考までに、下記URLは、私が運用しているEleventyを使用したサイトになります。

- Site URL: [unlimited text works, the 4th.](https://dollplayer2501.netlify.app/)
- Source code: [dollplayer2501/Eleventy-netlify-V2: Eleventy with Laravel Mix, Gulp](https://github.com/dollplayer2501/Eleventy-netlify-V2)










//
