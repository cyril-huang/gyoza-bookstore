.. SPDX-License-Identifier: GPL-3.0-or-later
.. Copyright (C) 2014  Cyril Huang, Gyoza Associate, Inc

.. This program is free software; you can redistribute it and/or
.. modify it under the terms of the GNU General Public License
.. as published by the Free Software Foundation; either version 2
.. of the License, or (at your option) any later version.

.. This program is distributed in the hope that it will be useful,
.. but WITHOUT ANY WARRANTY; without even the implied warranty of
.. MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
.. GNU General Public License for more details.

.. You should have received a copy of the GNU General Public License
.. along with this program; if not, write to the Free Software
.. Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

.. contents:: Table of Contents
   :depth: 3

====
簡介
====

電腦對一般人影響最大的就是資料的儲存，稍微正式的資料就是文件，文件裡面其實
有很多習慣跟規定的。

規格與邏輯結構
==============

在我剛上大學的時候，老師出的第一份作業規定要用A4的紙交上來，我完全聽不懂什
麼是"A4"，只知道很新鮮也很惶恐，一大堆新的名詞，後來才知道這是紙張的規格。
大人跟小孩最大的區別在於大人被一大堆人為定義的規格名詞給綁死了，整天追著世間
定義的規則並且參加了一堆遊戲規則的世間遊戲，並且在這遊戲中痛苦掙扎。
在美國生活的這麼多年中，更是深深了解到西方社會中的種種規定與規格多如牛毛
。

在使用DOS/pe2後，我們來到了Amipro/Word，這很漂亮的WYSIWYG軟體，
可以很快的設定字的大小，斜體，粗體等等來強調文件內容的字型長相，我們很快的
用這樣的軟體來交作業，寫報告，看起來圖文並茂。但是我們發現其實每次設定這些
字型常常在做重複的事情，原因在於圖文並茂的文件他有個隱藏的自我規格在裡面，
例如標題, 加重印象的強調文字，數字的列舉文字等等。

我們在Word/Amipro等軟體發現了原來他早就有預先設好的文件邏輯結構，包括了
header, list, paragraph等等,只要把某段文字框起來就不用自己設來設去。
後來會發現大部分的邏輯結構不外乎就是這些東西而已，只要賦予定義，某段文字
就變成這個定義。大致上的邏輯元素有

comment
  像寫程式裡的comment，註解。

TOC
  table of content，目錄，這有的不見得有

header
  或者叫做section，一層一層章節，如html的<head1><head2>。

paragraph
  通常就是一個段落文字text，會有空白行在兩個段落間。

list
  這有很多種，有可能前面長個小點，有可能是1. 2. 3.這種的。

literal,pre-text
  這是通常用在code, 或者對於原本語法逃脫的段落文字。空白換行都是原本的含意。

link
  hyper link文字。

table
  這是表格

image
  插圖

document generator與style sheet
===============================

在上面的文件邏輯結構中，其實並沒有"定義"他必須長什麼樣子，head必須是22點的還
是24點的大小，或者
chapter的文字多大多小，斜體字要多斜，粗體字要多粗等等完全沒有定義，只知道說有
這種邏輯元素存在。要定義邏輯結構的輸出長相的東西稱為style sheet。這樣的定義也
有語法的，例如plaintex, postscript,pdf...最有名的很多人都知道的莫非是CSS了。
文件邏輯定義層跟style sheet層，可以是兩個完全不相干的語言來描述，只要能夠解析
(parse)，轉換(translate)，輸出(output)就好。但其實這都只是再多加一層或多減一
層定義而已，所以常常會分不清楚，例如plaintex與LaTex，只是多包一層外圍的新定義，
但也有如docbook/dsssl是兩碼子事情，也有如html/css/browser的混淆。總之負責解析，
轉換輸出的工具軟體就是document generator了。

分層在實作中不見得這麼的明確，所以在很多術語中，很多人會搞糊塗。有的document
generator，把style sheet綁在自己裡面，user是沒有感受的。有的是文件定義跟style
sheet一起，也就是說這個分層常常是有的這一層藏在某一層裡面。有的實作卻又分得
很清楚。

========
標準排版
========

標準排版軟體

LaTeX
=====

這是電腦排版的神級軟體TeX的文件系統。真不知道從何說起才好。總之這套會了，就不
用玩別的了。這起源於最早鼎鼎大名的Knuth教授不滿意他的數學示子被書商排的很醜
，最早的排版都是使用傳統排字機(typsetting machine)，但是他的書第一版跟第二版相隔
了8年，打字機已經不一樣了，印出的品質不滿意下，無意間發現了數位排字系統很棒，
所以後來乾脆就自己開發了這個數位幕後排版語言。TeX最早也是只能在固定的排字機上
輸出使用而已。

TeX是個語言，就像是程式語言般，可以在基本元素上加上自己的功能，開始寫重複性的
function (或者叫 macro)，很多 macro 集合就是 module， library， package 等名詞。
總之都是分類的一層層的某種名詞而已。TeX 的語言就是一種數位排字
( digital typesetting )，都是以::

  \cmd{param}

這樣排字命令形式出現。那如果要某段很大段的文字都在某一種命令下，
叫做environment而用::

  \begin{some_env}
  all text inside environment belong to some function
  \end{some_env}

某個命令或某種environment只有在某package中才會出現，就像要用sqrt()要先
#include <math.h>一樣。可以去參考TeX reference
`TeX reference <http://www.tug.org/utilities/plain/cseq.html>`_ 不過我想不需要
去搞這個吧。

PlainTeX 是當初 Knuth 根據自己寫的TeX所寫的 macro，就像C基本函式庫一樣，c 語言要帶
著標準c 函式庫，裡面有 printf, read/write 等等基本函式，plaintex 就像是一個基本
函式庫，定義了一些文字處理的函式，像\\it xxxx, 表示 xxxx 要斜體 (italic)，\\box
劃一個框框。 或者一些控制的函式 \\bye 等於c裡面的 exit()。plainTeX 的參考
`plaintex reference <http://infohost.nmt.edu/tcc/help/pubs/texcrib.pdf>`_
，這也不需要去搞他。

LaTeX是Leslie Lamport這位先生又進一步寫的macro，這裡面就開始整個文件的邏輯
元素出現，例如\\documentclass \\chapter \\section這些東西出現了。所以我們主要
是熟悉LaTeX的這些數位排字macro來製作我們文件。LaTeX還提供了\\usepackage
來讓其他的人寫出更多的元素來嵌入LaTeX系統。這也是通常使用不同的style sheet的
方法，\\usepackage{xxx} 就會用上xxx的一些設定，例如顏色，大小等等。
`LaTeX reference <http://en.wikibooks.org/wiki/LaTeX/Command_Glossary>`_
其實只有幾個常用的。
`LaTeX cheetsheet <http://www.stdout.org/~winston/latex/latexsheet.pdf>`_

字型系統一般人最熟悉的就是 Windows 上的 ttf 格式了，其實就像圖形有 jpg, gif 等格式
，在沒有Adobe 蘋果的ttf前面，Knuth 教授用的是他自己的 metafont，也是用
`貝茲曲線 <http://en.wikipedia.org/wiki/B%C3%A9zier_curve>`_
來描述整個字型的長相。不同的系統只要有數學就能轉換，所以後來opensource的人，
當然有辦法統整所有字型。數學式子是LaTeX最厲害的強項，可以排出非常漂亮的文件。

除了TeX，LaTeX本系統外，還有很多眾多的輔助package可以安裝來做出各式各樣的文件
，這就是很多人覺得頭痛的地方，目前的包裝比較有名的應該是 texlive 這個包裝，收集
很多package。就把他想成特別收集tex/latex系統的一個懶人包。一個package指的是
很多macro集合的一個檔案，以.sty為副檔名，texlive 收集了很多.sty 的 package。
例如能在每頁頁眉上寫上特殊章節，論文常會有引用別人論文的bibliography等效果
。 `CTAN <http://www.ctan.org/>`_ 是官方全部的收集與搜尋的地方。整個系統非常
龐大與複雜，畢竟這有幾十年的歷史，有些東西除非真有興趣，否則可以先掠過。專注
在我們想要的文件輸出就好。除了texlive外，還有MacTex, MikTeX就像linux有 debian
redhat, slackware等等。

目前的輸入文字格式處理以及輸出引擎有

tex
  Knuth先生自己寫的引擎，目前為1990 第3版，輸入需為 8 bit 編碼字元，plain TeX
  語法，輸出本來為特定的Xerox排字機，後為不圖利任何廠商的開放 dvi 格式，後來
  有很多driver，根據 dvi 再轉換成新格式，例如pdf, postscript, HP雷射印表機讀懂
  的格式等等。

pdftex
  比tex新的引擎，輸入字元編碼為 2bytes  LaTeX 語法，輸出有兩種模式，dvi 與直接
  pdf 模式，目前內定的 latex 引擎其實就是 pdftex, 系統上 latex, pdflatex 都只
  是他 symbolic link。輸入中文需要特別的 CJK package。

xetex
  比pdftex更新的引擎，直接輸入能處理 unicode 文件， LaTeX 語法，而字型處理
  也能比較簡單的處理 TTF, openType 字型， 這引擎輸出 extend dvi (xdv) 然後轉
  成其他像 pdf。這處理 unicode 中文比較直觀，也不需要額外的 CJK package。
  texlive 有這個引擎包裝，處理LaTex 時呼叫 xelatex ，轉成xdv檔先。

luatex
  unicode input, LaTeX語法，使用Lua script語言。texlive也有這引擎包裝。

我們將安裝使用傳統 pdftex 與 xetex 的 texlive 包包。裝了texlive-xetex後，會自動
裝 pdftex 與 xetex 兩種引擎。

準備
^^^^

debian套件:

  texlive, texlive-xetex,
  texlive-extra-utils (裡面有轉換 html 的 make4ht)
  latex2html, latex2rtf, (額外轉換工具)
  latex-cjk-chinese (可不裝，如果使用 xetex 的話)

網頁文件:

  * https://www.tug.org/texlive/acquire-netinstall.html
  * https://github.com/cyril-huang/gyoza-bookstore/latex-intro

tag參考:

  * https://en.wikibooks.org/wiki/LaTeX
  * https://texdoc.org/index.html
  * http://www.latex-project.org/guides/usrguide.pdf

如果使用xetex做為tex引擎，那可以不裝latex-cjk-chinese，而如果要裝
latex-cjk-chinese, 她會把簡體字型也裝起來，可以不要裝，只裝 
latex-cjk-arphic-chines-bkai00mp 與明體bsmi00lp。

安裝上也可以下載 texlive 的 網路安裝 script,
https://www.tug.org/texlive/acquire-netinstall.html

 * 執行 ./install-tl
 * 調整選項，按 S 選 c ，small scheme, 這個會裝 xetex 引擎。
 * 繼續調整其他，按 D 像是 TEXDIR TEXMFHOME 目錄。
 * 裝完後，要多增加 PATH, MANPATH, INFOPATH，就可以用了。
 * 多裝 xeCJK -> tlmgr install xeCJK

Example
^^^^^^^

::

  %這是註解
  \documentclass{book}
  \usepackage{xeCJK}
  \usepackage{fontspec}
  \usepackage{graphicx}
  \setCJKmainfont{Noto Sans CJK TC}

  \title{My Title}
  \author{first last}

  \begin{document}
  \maketitle
  \tableofcontents

  \chapter{章}
  第一章
    \section{節}
    第一節
      \subsection{再來}
      第一次節

      paragraph段落也是用空白行分開，強迫換行可以用兩個反斜線\\

      literal文字必須用\verb=\verb或envoronment \begin{verbatim} \end{verbatim}=
      像底線\verb=__variable__=括號\verb={=都需要。

      或者用
      \begin{verbatim}
      literal block 所有字都脫逃
      sub myfunc {
          return 1;
      }
      \end{verbatim}

      \begin{itemize}
        \item item 1
        \item item 2
      \end{itemize}

      \begin{tabular}{|l|c|r|}
      \hline
      first   & row & data \\
      second  & row & data \\
      \hline
      \end{tabular}

      插圖
      \begin{figure}
      \includegraphics[height=2cm,width=5cm]{mypicture.jpg}
      \end{figure

  \end{document}

基本說明與注意事項

- [ ] 中括號括住的是選擇性參數，可以省略，{ } 大括號的不能省略
- 所有命令從\\begin{document}後開始
- paragraph段落會自動縮排，但段落間不會空行。
- 文字後面跟著兩個反斜線\\\\表示強制換行，如果要空行，就簡單用這個。
- 但是兩個反斜線\\\\ 不能在跟在環境\env{} \end{}後，必須在文字後。
- \\verb後跟著的第一字元表示後面跟著的所有東西到這字元都脫逃。
- 常要escape的字元有<  > % $ ^ & # \ _ { } [ ]
- 中文使用 xeCJK package 
- table of contents，必須跑兩次xelatex。
- 一些會用的package像html, hyperref, fancyhdr, graphicx就很夠了。

轉換產出
^^^^^^^^

::

  $ xelatex xxx.tex; xelatex xxx.tex
  $ make4ht xxx.tex xxx.html
  $ latex2html xxx.tex
  $ latex2rtf xxx.tex

  這是比較原始的命令，如果用英文還有eps圖檔會好一點。

  $ latex xxx.tex   # 生出xxx.dvi, 圖形有jpg,png不行
  $ dvips xxx.dvi   # 生出postscript檔
  $ xdvi xxx.dvi    # 使用xdvi觀看結果

轉換產出比較多奇怪的麻煩，原因在於tex是古老的東西，有很多古老的格式跟規定，包
含了幾十年的歷史與技術的演進，會跑出一堆中間格式檔，例如dvi, toc, log, aux...
，整個系統的副檔名很繁雜，不想搞清楚的話，可以直接裝一些套件轉pdf, html就好。
另外latex2html有很多package沒有實作，例如寫code很好用的lstlisting，這種無法轉
出來是比較傷腦筋一點。

錯誤訊息

有些錯誤或者結果不是想要的，來自於之前產生的檔案xxx.aux沒有砍掉，把他砍了就
好了。

::

 There is no line here to end
  這是因為\\newline或者\\\\不能單獨成為一行，必須跟著某段文字後面才行
 Package pdftex.def Error: PDF mode expected, but DVI mode detected!
  這是因為使用了\\usepackage[pdftex]{graphicx}，此為pdf mode，只能使用pdflatex
  命令，不能使用dvi mode命令latex了。
 LaTeX Error: Can be used only in preamble.
  這是在begin{document}之前的命令出問題，有可能是AtBeginDocument，有可能是
  usepackage的順序或者dependancy有問題。
 Package inputenc Error
  中文忘了加\\usepackage{CJKutf8}
 CJK@XX 或者 CJK@XXX之類的
  這是 pdflatex 中文使用，這個說來話長，總之加上\\clearpage在最後面可以解決。
 {\contentsline {subsubsection}{subtitle}{26}{section* 
 ! File ended while scanning use of \@writefile.
 <inserted text> 
                \par 
 l.68 \begin{document}
  當有這個 \@writefile 錯誤出現，是整個命令亂掉，通常是圖形不支援，這有點
  奇怪的是用 eps 反而出錯，用 png 就好了。

過去用 pdflatex 編譯 tex 檔，對於字型還有中文處理都不是很理想，過去要用 type1
字型，改用xetex重新編譯 tex 檔，但是必須拿掉以往 CJK 的奇怪部份，主要四個東西，
CJKutf8 package, 還有 begin end CJK，跟那個奇怪的 clearpage。

::

 ...
 \usepackage{CJKutf8}
 ...
 \begin{document}
 \begin{CJK}{UTF8}{bkai}
 ...
 \clearpage
 \end{CJK}
 \end{document}

然後主要在
\documentclass{xxx} 後面加上使用字型的設定 

::

  \usepackage{xeCJK}
  \usepackage{fontspec}
  \setCJKmainfont{Noto Serif CJK TC}
  \setCJKsansfont{Noto Sans CJK TC}
  \setCJKmonofont{Noto Mono CJK TC}

分別為 roman，sans-serif, mono spaced字型，roman 字型主要用於當作基本字體，
所以本文字體多為roman字體。 sans-serif 是字型沒有多餘的修飾線在字的尾巴，
相對於serif字體是有襯線的。主要使用headline, caption標題中。
mono 是用來做等寬的字型，所以很多terminal喜歡用這種字。還有 italic 是斜體。
字型名字來自於系統的字， 而字型由於能使用ttf , openType ... ，只要下載ttf 
檔，放到~/.fonts, 安裝 xfont-utils, 執行 mkfontscale, 安裝 fontconfig, 
執行 fc-list 可以看到你所擁有的字型。以我來說

::

  ...
  /usr/share/fonts/X11/Type1/c0648bt_.pfb: Bitstream Charter:style=Regular
  /home/cyril/.fonts/TibMachUni-1.901b.ttf: Tibetan Machine Uni:style=Regular
  /usr/share/fonts/type1/gsfonts/c059013l.pfb: Century Schoolbook L:style=Roman
  /home/cyril/.fonts/wt034.ttf: HanWangKanTan,王漢宗勘亭流繁:style=Regular
  /usr/share/fonts/truetype/wqy/wqy-zenhei.ttc: WenQuanYi Zen Hei,文泉驛正黑,文泉驿正黑:style=Regular
  /usr/share/fonts/truetype/wqy/wqy-zenhei.ttc: WenQuanYi Zen Hei Sharp,文泉驛點陣正黑,文泉驿点阵正黑:style=Regular
  /usr/share/fonts/type1/gsfonts/d050000l.pfb: Dingbats:style=Regular
  /usr/share/fonts/type1/gsfonts/n021023l.pfb: Nimbus Roman No9 L:style=Regular Italic
  ...

我有Bitstream Charter, 也有西藏文字Tibetan Machine Uni, 也有中文... 等等字型。
這就是3個設定字型名字的來源，要填入的是第2欄位，'WenQuanYi Zen Hei'。所以不用
再裝亂七八糟的 Big5 gb 碼的字型，也不再裝latex-cjk-chinese等東西了。 這樣比較
乾淨。 而執行 xelatex 後會自動產生 pdf 檔。

::

  $ xelatex xxx.tex; xelatex xxx.tex

Docbook/SGML/XML
================

SGML/XML是一種所謂的markup language，就是長的像HTML那種樣子的都是markup語言。

::

 <element>
   I am element 1
  </element>

這樣的就是，所以html只是後來衍生出的一種。

在head/list/paragraph之上其實有更抽象化的一層，是用來定義這些head/list...
的，這稱為DTD(document type declaration),應用上，我們很少會去注意這一層，
這是給實作這些東西的寫程式的人的資料結構。對於tag的定義稱為DTD
(document type definition), 這就是上面講的文件邏輯結構，會有這樣的區別在於
當我們的應用只注重在所謂的文件邏輯結構上時，我們的想法就只是單純的chapter,
section, list....這些東西，但是最原始的sgml不光是為了文件而是為了結構化的資料
，所以document type declaration是資料的定義長相，

::

  <!ELEMENT lines (line*)
  <!ELEMENT line O - (#PCDATA)>
  <!ENTITY   line-tagc  "</line>">
  <!SHORTREF one-line "&#RE;&#RS;" line-tagc> 
  <!USEMAP   one-line line>

這裡面定義了lines跟line這兩個元素，再多一層的文件中就能使用。

::

  <line>first line</line> 
  <line>second line</line>

這就好像寫C語言時，我們使用int, char，其實他底層int,char是有更基本的定義的。
但我們的目的不在這，我們只想要寫文件而已。docbook就是對於文件寫作的一組
document type definition，他定義了

::

  <chapter>
  <paragraph>
  ........

所有的這些元素集合，就是一組文件DTD(document type definition)，
其他有名的如linuxdoc這個DTD，或者一些論文期刊規定的寫作規定DTD。例如論文可能
不需要chapter這個tag，在他的DTD定義中就沒有。通常這種文件都要有個相對應的DTD
validation工具來先檢查一遍看是否你的sgml文件是否正確，正確了才能用後續的style
sheet產出工具生產文件。

廣泛使用的style sheet語言為dsssl，openjade是實作出dsssl語言parser的project，
特別為docbook所作的document generator軟體為docbook-utils下面的db2html, db2pdf

準備
^^^^

debian套件:
  docbook, docbook-utils
網站文件
  http://www.docbook.org/docs/
tag參考
  http://www.docbook.org/tdg5/en/html/docbook.html

Example
^^^^^^^

::

  <!-- 註解 comment -->
  <!doctype article PUBLIC "-//OASIS//DTD DocBook V3.1//EN" []>
  <article>
    <title>My First Docbook Practice</title>

    <abstract>
    <para>
      Text for abstract: This is a demostration of what a document 
      should be. We
      don't need to care about what the document looks like, but the 
      content itself
    </para>
    </abstract>

    <sect1 id=intro>
    <title>Introduction</title>
    <para>
      If this is a book, then it must be a book.
    </para>
    <para>
      This is the second paragrph, we try to see what's going on
      here and try to make it multiple paragraphs.
      The following is a literal text, that is all text between
      <literal>&lt;literal> and &lt;/literal> </literal>
      are not be intepreted by SGML system
    </para>
    <para>
      And this is <emphasis>emphsized text</emphasis>, not bad.
    </para>
    </sect1>

    <sect1>
    <para>
      The following contents is a demo of list and table
      <itemizedlist>
        <listitem>
          <para>
            This is item 1, try to make the item length to a long 
            length that will oversize a normal line to see what happen.
          </para>
        </listitem>
        <listitem>
          <para>
            This is item 2
          </para>
        </listitem>
      </itemizedlist>    
    </para>
    </sect1>

  </article>

基本說明與注意事項

- docbook實在太囉唆了，我玩過一次後就再也不玩了。寫得手酸死了。
- 比較要注意的就是docbook是有版本的，也就是那些tag的DTD定義是會變化的，所以使
  用 validation 工具也是有版本的，例如可能某版沒有listitem。前面的doctype這行
  的格式要注意的就是article跟版本的寫法。article也能改成是book或chapter的選項，
  。這格式在docbook 5.0後有很大的變動，需小心。

轉換產出
^^^^^^^^

::

  $ db2html my.sgml
  $ db2pdf my.sgml
  $ db2rtf my.sgml

============
簡化文件系統
============

上面講的文件系統，實在是太龐大了，往往我們只要簡單的表達意思，卻掉入學習的泥沼
中，即使不想管那些內部設計與結構，光看到一堆typesetting排字的命令，或者tag就
昏倒了。而且往往寫那些tag手都酸了。因此有些簡化系統出現讓小文件方便產生。

roff/man page
=============

man page是很多人剛學unix系統必讀的文件，很多命令或者API都使用man來達到線上help
。在development中也是需要寫man文件的。

roff是所有這種typesetting系統的通稱，有troff,nroff,groff等這些document產生器。
roff格式可以回溯到1960年代最早的Unix的前身Multics系統就有了。

roff
  最早在Multics上的文件產生器命令。
troff
  (typesetter roff)輸出給一種叫CAT的排字機用的。
nroff
  是輸出給terminal用的
groff
  GNU的重新implementation

準備
^^^^

debian套件:
  man-db
網頁文件
  https://www.kernel.org/doc/man-pages/online/pages/man7/man.7.html
tag參考
  - https://www.kernel.org/doc/man-pages/online/pages/man7/man.7.html
  - http://linux.die.net/man/7/groff

Example
^^^^^^^

::

  .\" comments
  .TH "my person Title" 3 11-20-1969

  .SH NAME
  myfunc \- this is my function

  .SH SYNOPSIS
  .B myfunc(char *, int);
  .PP
  .B myfunc(char [], int);

  .SH DESCRIPTION
  myfunc is just an example for roff system and this is the paragraph in
  description. If want special effect, such as
  .I italic
  or
  .B bold
  you need to restart a new line.
  .PP
  The list demostration should use \.HP, \.IP and \.TP the indentation
  paragraph commands. The indentation space can be specifized and default
  is 8.
  .PP
  .SS HP
  This is for general indent list
  .HP
  This is 1st list description

  The HP should be followed a empty line and the whole paragraph will be
  indent.
  .HP
  This is 2nd list description

  The definition text indent after a new empty line
  .HP
  list 3
  .HP
  list 4
  .P
  .SS IP
  Use IP for different kind of list with first argument varies to change
  differnt effect.
  .IP "def1, def2"
  The string as first argument to IP as the definition list and it's
  very similar to HP but there is no empty line between word and definition.
  .IP \(bu 4
  The bullet list with \\(bu as first argument to IP
  .IP \(bu 4
  The bullet list with \\(bu as first argument to IP
  .P
  .IP \(em 2
  The hyphen list with \\(em as first argument to IP
  .IP \(em 2
  The hyphen list with \\(em as first argument to IP
  .P
  If want to use 1. 2. 3., just use those string as argument of IP
  .SS TP
  TP has the same effect as IP but same syntax rule as HP.
  .TP
  TP list1
  No empty line between them
  .TP
  TP list2
  .TP
  TP list3

  .SH RETURN
  Return -1 if error or 0 if successful

  .SH COPYRIGHT
  GNU GPLv3

基本說明與注意事項

- 意義

  - .\\"  comment 註解
  - .TH  title header, 格式為.TH title section date source manual
  - .SH  section header
  - .SS  sub section 只能有一層sub section，不能多層。
  - .B   bold粗體字
  - .I   斜體字  
  - .PP  與.P .LP一樣，都是換靠左對齊之paragraph，也拿來做換行用。
  - .IP  是indentation paragraph，所以常拿來做list之用。

- 當去看/usr/share/man下的man page時，會看到很多沒看過的，有的是專屬於troff或
  groff的新命令。ad, bp, br, ce, de, ds, el, ie, if, fi, ft, hy, ig, in, na, 
  ne, nf, nh, ps, so, sp, ti, tr. 這些就像shell一樣，原本的Broune Shell的變種
  ksh, bash會多新功能出來一樣。這在 man 7 groff 文件中有詳細解說。
- 所有的hyphen - 都要加上反斜線，特別注意的是NAME，一定要有反斜線格式像這樣

::

  .SH NAME
  myfunc \- description

- SH的項目(會與說明目標跟每個人習慣而不一樣)

  - NAME
  - SYNOPSIS
  - DESCRIPTION
  - RETURN
  - ENVIRONMENT
  - EXAMPLE 
  - SEE ALSO
  - COPYRIGHT

轉換產出
^^^^^^^^

::

  $ nroff -man myman.3.gz
  $ man ./myman.3.gz

基本上產出的man page會放到MANPATH去，在Linux下就是/usr/share/man，有8個section
，每個section有特別意義

- 1 表示一般命令
- 2 表示system call API
- 3 表示user library API
- 4 特殊檔案。例如/dev/xxx的解說
- 5 file format的解說。 例如/etc/xxx.conf
- 6 game
- 7 其他
- 8 admin系統管理命令 

所以要根據你的man是什麼性質，放到特別的地方去。

HTML/CSS
========

HTML不用介紹了吧，這也是很多人開始了解所謂markup的開始，其實就是物理學家從SGML
偷來的表示方法，只不過把SGML裡面複雜的東西簡化來簡便使用。基本上HTML不是一個
文件系統啦。

debian套件
  htmldoc
網頁文件:
  http://www.w3.org/TR/html5/
html tag參考
  http://www.w3.org/TR/html5/semantics.html#semantics
CSS 參考
  http://www.w3.org/TR/2012/WD-css3-writing-modes-20121115/

準備
^^^^

就是裝browser

debian套件:
  chromium

Example
^^^^^^^

::

  <!-- 註解 comment -->
  <html>

    <head1>
    <title>my head 1, BIG HEAD</title>
    <link href="../css/style.css" rel="stylesheet" type="text/css">
    <head1>

    <p>
    paragraph is simple
    </p>

    <ul>
      <li> list 1
        <ul>  nest 1
        </ul> nest 2
      <li> list 2
    <ul>

    <pre>
    literal 符號都不會被解釋轉換
    &amp 
    </pre>

    hyper link
    <a href=http://www.xxx.com>hyper link</a>

    圖片
    <img src=http://www.xxx.com/xx.jpg>
      
  </html>

  style.css 檔案內容，會有關於顏色大小的設定

  body {
    background-image:url(images/bd_red.gif);
    color: #000000;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: 12px;
    margin: 10px 10px;
  }

  h1 {
    fint-size: 24px;
    margin: 20px 0px 20px 0px;
  }

  h2 {
    color: #85a157;
  }

基本說明與注意事項

在沒有CSS前，他的style sheet已經被browser給定死了，<head1>長怎樣就是怎樣，跟
LaTex的基本用法一樣，chapter, section...的長相不需要去理會。不過伴隨著美工的
要求越來越多，開始提供CSS人為定義，browser也必須能解讀CSS來提供特別的螢幕輸出。

轉換產出
^^^^^^^^

htmldoc -f mypdf.pdf myhtml.html

reStructuredText/lightweight markup
===================================

在使用SGML時，你會發現累死人了，要表達一個簡單的東西，tag比內容還要多，而且
如果看文字檔時，一堆tag中根本就看不出原本的內容的重點為何了。這也影響了後面
XML轉換到JSON的主要原因。雖然很多DTD很強大，把人間幾乎會用到的所有格式考慮
很清楚，定義很完整，但很多時候大部分都是加強的累贅。在網際網路發展中，有很多
人也有玩過所謂的共筆wiki，也就是一些資訊由一堆人共同寫作完成。他裡面的資訊
邏輯結構定義就用一些很簡單的"符號"來表現出來，統稱這種為lightweight markup。
例如 - 在前面就表示一個list了，不用寫一堆文字形式的累贅格式。
這最有名的兩個要算ReST(rst, reStructuredText)與Markdown了，rst形式的
他有個docuemnt generator, docutils。

準備
^^^^

debian套件
  python-docutils
網頁文件:
  * https://docutils.sourceforge.io/docs/ref/rst/restructuredtext.html
tag參考
  * https://docutils.sourceforge.io/docs/user/rst/quickref.html
  * https://docutils.sourceforge.io/docs/ref/rst/directives.html
  * https://docutils.sourceforge.io/docs/user/config.html

Example
^^^^^^^

::

  .. comments with dotdot

  .. contents:: Table of Contents
     :depth: 3

  ============
  最上層header
  ============

  這是paragraph
  即使分行也會併成一行

  - list 1

    1. nest list1
    2. nest list2

  - list 2
  - list 3

  ::

  literal block可以寫code但是也有更好用的directives
  另外可使用\來逃脫\
  
  ::

    class myclass(object):
        def __init__(self):
            return None

  hyper link前後要有空格或換行 `hyper link文字 <http://www.xxx.com>`_
  才行 

  這是table
  +------------+------------+-----------+
  | Header 1   | Header 2   | Header 3  |
  +============+============+===========+
  | body row 1 | column 2   | column 3  |
  +------------+------------+-----------+
  | body row 2 | Cells may span columns.|
  +------------+------------+-----------+
  | body row 3 | Cells may  | - Cells   |
  +------------+ span rows. | - contain |
  | body row 4 |            | - blocks. |
  +------------+------------+-----------+

  插圖

  .. image:: images/ball1.gif
    :height: 100px
    :width: 200 px

  再來一層header
  ==============

  可以好多層
  ^^^^^^^^^^

基本說明與注意事項

- ..除了做comment外，還有做額外directives的功能，.. directive\:\:
  可以讓元素更多樣化，其中我常用的就是table of contents。
- 每個特別符號前後都空白一行，所以注意nest list的用法與literal \:\:用法。
- hyper link前後要有空格或換行，要小心。
- 縮排空格有意義，表示整個縮排block是跟著前面的特殊意義，例如literal,list block
- literal的文字長度不要超過78，不然在pdf中會被砍掉。

轉換產出
^^^^^^^^

::

  $ rst2html my.rst > my.html
  $ rst2latex my.rst > my.tex
  $ pdflatex my.tex

如果是中文latex用傳統pdflatex引擎的，則要加上usepackage{CJKutf8}跟clearpage，
所以中文產生latex自己去打開那個my.tex，手動加上之前latex的中文注意事項

網路上有另一種說法是用AtBeginDocument的

::

  $ rst2latex --latex-preamble='\usepackage{CJKutf8}
                                \AtBeginDocument{\begin{CJK}{UTF8}{bkai}}
                                \AtEndDocument{\end{CJK}\clearpage}'
                                my.rst > my.tex
  $ pdflatex my.tex
  $ pdflatex my.tex

::

  $ rst2latex my.rst > my.tex
  $ sed -i -e '/^\\documentclass.*/a\\\usepackage{CJKutf8}' \
           -e '/^\\begin{document}/a\\\begin{CJK}{UTF8}{bkai}' \
           -e '/^\\end{document}/i\\\clearpage\\end{CJK}' my.tex
  $ pdflatex my.tex
  $ pdflatex my.tex

table of contents要結先跑出toc檔，所以跑兩次pdflatex才跑得出來。不過我後來改用
xelatex 會好一點。

::

  rst2xetex my.rst > my.tex
  sed -i '/setmainfont/d' my.tex
  sed -i '/setsansfont/d' my.tex
  sed -i '/setmonofont/d' my.tex
  sed -i '1a\
  \\usepackage{xeCJK}\
  \\usepackage{fontspec}\
  \\setCJKmainfont{$(font)}\
  \\setCJKsansfont{$(font)}\
  \\setCJKmonofont{$(font)}' my.tex
  xelatex my.tex
  xelatex my.tex

markdown/lightweight markup
===========================

另一個最常用的就是markdown, md了，他被github, stackoverflow, reddit...等
大公司使用，所以非常的流行，他用了很多html的tag, 所以介於html與rst間，
熟悉html的人應該會滿喜歡的。最後有一個叫pandoc的轉換工具，非常的方邊的轉換
上述各種format, pdf, latex, html, 不過markdown很隨興，所以沒有很嚴格定義與
維護，現在多了很多延伸使用，尤其是github的使用。


準備
^^^^

debian套件
  markdown
  pandoc
網頁文件:
  * https://www.markdownguide.org/getting-started/
tag參考
  * https://www.markdownguide.org/basic-syntax/
  * https://www.markdownguide.org/extended-syntax/

Example
^^^^^^^

::

  <!- comment 用 html 的 ->

  # Header 1
  ## Header 2
  ### Header 3
  #### Header 4

  *斜體*  或者 _斜體_
  **粗體** 或者 __粗體__
  _又斜又粗_**
  ~~刪除線~~

  * item 1
  * item 2
    * item 2-1
    * item 2-2

  - item can use - as well
  + item can use + as well

  1. order1
    - item1 under order1
    - item2 under order1
  2. order2
    2. order2-1
    2. order2-2

  [連結](http://www.google.com)_
  [連結](../file)

  可以使用back-quote，來表示這是code `$ ls -l`。 3個表示一段code

  ```python
  for i in range(10):
      print i

  ```

  table

  | Tables        | Are           | Cool  |
  | ------------- |:-------------:| -----:|
  | col 3 is      | right-aligned | $1600 |
  | col 2 is      | centered      |   $12 |
  | zebra stripes | are neat      |    $1 |

  插圖

  ![alt text](https://myicond.com/icon48.png "Logo Title Text 1")

基本說明與注意事項

- 縮排空格有意義，表示整個縮排block是跟著前面的特殊意義，例如literal,list block

轉換產出
^^^^^^^^

::

  $ pandoc mydoc.md --pdf-engine=xelatex -o mydoc.pdf

=======
程式API
=======

在程式寫作中，很大一部分的文件就是API文件，這是幫助定義API的人與使用API的
人的重要文件。有很多語言本身就帶有把code裡面的comments內的文字轉成使用說明
書，一來給寫code看code的人釐清問題並且定義好要作的事，二來給將來使用者文件
，這樣的工具可以說一舉兩得很棒。javascript, java本身就帶有這樣工具，但他們
都是從以前的小工具聯想而來的。所以使用語法都很像。

在目前opensource有很多工具，對於C，我用的是doxygen，可以轉出任何想要的格式，
其他jsdoc/javadoc的語法也差不多是那樣。

doxygen
=======

doxygen是個不錯的工具, c/c++, java, python, php,...都能使用。唯一遺憾的是
perl好像不太好用。我通常只有c在用。在header .h檔案中，對於每個API說明使用。

準備
^^^^

debian套件: 
  * doxygen
網頁文件:
  * http://www.stack.nl/~dimitri/doxygen/manual/starting.html
tag參考:
  * http://www.stack.nl/~dimitri/doxygen/manual/commands.html

這個debian doxygen很白痴的會去裝texlive-latex-extra-doc，很恐怖的325M的文件，可以
把texlive-xxxx-doc都拔掉，不要裝。

Example
^^^^^^^

::

  /**
   * @brief Get the content of eeprom.
   * 
   * There is an EEPROM inside backplane with 256 bytes capacity. This
   * routine gets the content of eeprom according to the parameters.
   *
   * @param offset the offset from the whence.
   * @param size the total size in bytes will be read.
   * @param whence the position where starts to read with following value.
   * <ul>
   *  <li>SEEK_SET
   *    <ul>
   *      <li>The offset is set to offset bytes.
   *    </ul>
   *  <li>SEEK_END
   *    <ul>
   *      <li>The offset is set to the size of file plus offset bytes.
   *    </ul>
   * </ul>
   * @return A string of the content in eeprom
   *
   * @sa xy_cpus xy_ethernet
   *
   * Example
   * @code
   *   xy_eeprom(10, sizeof(mycontent), SEEK_SET);
   * @endcode
   */
 
基本說明與注意事項

doxygen會有一個內定的conf檔案叫Doxyfile，這檔案裡面有很多選項跟key/value值，
可以設定是否要產生html, pdf檔以及一些設定等等。我們去修改這個檔案後，呼叫
doxygen。主要設定

::

  PROJECT_NAME
  GENERATE_HTML = yes
  GENERATE_TREEVIEW = yes
  GENERATE_LATEX = yes

- 在註解使用 /** 表示開始doxygen的文件
- 使用@tag來表示特別意義
- 空白行表示paragraph 
- 能解讀某些html tag的能力，
- 新版有rst/markdown的list支援。可以不用html了
- 我常用的就brief, param, return sa(see also)還有code如上。

轉換產出
^^^^^^^^

::

  $ doxygen -g          # 生出Doxyfile
  $ doxygen Doxygen     # 生出html跟latex兩個目錄，可對他們加工達到想要效果
  $ make -C late        # 生成refman.pdf

額外的效果必須懂得latex語法，然後去修改轉出的latex檔，再使用pdflatex來轉出
pdf檔。同樣的html也是一樣，懂得html語法，加裝自己的style sheet或者
header/footer，讓文件適合自己公司。

pod
===

POD是perl的內部標準文件寫作方式。

準備
^^^^

debian套件:
  perl
網頁文件:
  * http://perldoc.perl.org/perlpod.html
tag參考:
  * http://perldoc.perl.org/perlpod.html

Example
^^^^^^^

::

  __END__

  =pod

  =head1 NAME

  Quark::Device - The general device class for a remote device.

  =head1 SYNOPSIS

    use Quark::Device;

    $d = Quark::Device->new('192.168.11.101', 'myuid', 'mypasswd');
    $d->cli("show run\n");
    $d->reboot();

  =head1 DESCRIPTION

  The general device derived from Quark::Session.

  =head1 METHODS

  =over 4

  =item new() $host, $uid, $passwd, $port, $prompt, $timeout, $logfile

  The constructor of the object. If $port is true with value, it will
  use telnet otherwise the default session using ssh. The default 
  timeout is 5 second and if the $prompt is not given, the session will
  tried to guess the prompt after $timeout is reached. The $logfile to
  log the message from the session. The arguments can be also a hash
  reference including the key/value. It's just a subclass of 
  Quark::Session and the constructor is the same as Quark::Session.

  =item add_power() @arg

  Add a new power device to the device. The argument can be an object
  of power device under the Quark::Device::Power or the array of $model,
  $host, $uid, $passwd... where the array of $host, $uid, $passwd... is
  the arguments for this model class.

  =item add_ipmi() @arg

  Add a new IPMI board to the device. The argument can be an instance
  under Quark::Device::Ipmi or the array of $model, $host, $uid, 
  $passwd... where the array of $host, $uid, $passwd... is the arguments
  for this model class.

  =item power() $action

  The action to power-on/off/cycle the device. See Quark::Device::Power
  for more details. This API controls the remote power center with internet
  ability or the standard IPMI. If there is no $action given, return the
  power status or -1 if error occurred. The status of power is the current
  status of total power devices. If the $action is ON, it will try to power
  on all power devices including power center and IPMI devices. If the
  $action is OFF and power center presented, it will just try to power
  off the power center devices. If there is only IPMI device presented,
  just power off the IPMI device.

  =item reboot() $cmd, $wait

  Reboot the device with the $cmd. If the $cmd is not given, the default
  is "reboot". It will wait for $wait seconds until the system is back.
  The default $wait is 30 seconds. Return 1 if the remote session is
  connected, 0 if the remote session is still down.

  =back

  =head1 MEMBER DATA

  =over 4

  =item power

  Array of power device attached. Defuault is undefined.

  =item ipmi

  IPMI device attached. Defuault is undefined.

  =back

  =head1 SEE ALSO

  Quark::Session Quark::Device::Linux
  Quark::Device::Ipmi Quark::Device::Power

  =head1 COPYRIGHT

  Copyright (c) 2010 Cyril Huang. All rights not reserved.
  Free software under the same terms as Perl itself.

  =cut

    
說明與注意事項

- 使用=pod來表示特別意義, =cut結束
- =tag前後一定要有空白行
- 空白行表示paragraph，整段paragraph不會換行
- 縮排空格表示literal，通常用來作example code
- list用=over =item =back來使用，可以nest。但也可以用literal來換行。
- 模組的head1通常用
  
  - NAME
  - SYNOPSIS
  - DESCRIPTION
  - METHODS
  - MEMBER DATA
  - CONSTANTS
  - SEE ALSO
  - COPYRIGHT

- API內文件格式隨意

  - func() $arg1, $arg2表示API
  - 我用標準list表示argument, member data與constant的說明

轉換產出
^^^^^^^^

::

  $ pod2man xxx.pm | nroff -man | less
  $ pod2latex xxx.pm
  $ pod2html xxx.pm

pydoc
=====

pydoc是python本身帶有的API document generator，她很簡單很好用，沒有特別格式，
只要在每個def xxx():下面直接用""" doc """就好，模組裡面的文件直接在interactive
python下命令help(mymodule)就會跑出man page.

準備
^^^^

debian套件:
  * python
網頁文件:
  * http://docs.python.org/2/tutorial/controlflow.html#documentation-strings
tag參考:
  * 沒有


Example
^^^^^^^

::

  #vim:sts=4:sw=4:et
  """ MyClass implementation. """

  __version__ = '0.0.1'
  __author__ = 'Gyoza'

  MY_CONST = 0
  NO_EXPORT = 1

  class MyClass():
      """ MyClass is my class.

      MyClass is really my class
      """
      def __init__(self, arg1 = 1):
          """
          Constructor for MyClass
          """
          self.a = arg1

      def get_a(self, arg1, arg2):
          """get_a return member data a

          arg1 :
          arg2 : 

          return :
          """
          return self.a

  __all__ = ['MY_CONST', 'MyClass']

  if __name__ == "__main__":
      mo = MyClass(5)
      print "my a is %d \n" % m0.get_a()

說明與注意事項

- 在class,function,method下面直接用""" doc """就可
- 但必須縮排至相對應的class,method底下。
- 前面空格沒有意義
- API文件格式隨意但有些不成文規定，但不見得遵守。因為python哲學是越簡單越好。

  - 第一行第一個字大寫，句點結束。這行就是標題"Capital and end with a period."
  - 第二行必須空白
  - 第三行開始Description，要小心的就是indentation而已。

- 沒有特別的list使用, 所以一切好自為之。
- 我通常用arg: 與return:說明參數與回傳值。通常使用16字元arg             :

轉換產出
^^^^^^^^

::

  $ pydoc module       # 會跑出man page的help。例如pydoc re或pydoc sys
  $ pydoc ./myclass.py # 自己寫的模組路徑名
  $ pydoc -p 1234      # 會跑一個在localhost:1234的http server，列出系統上API。
  $ pydoc -g           # 需要裝python-tk，會跑出一個GUI的API reference。

sphinx
======

pydoc顯得單薄了一點，於是sphinx是python後來出正式文件使用的工具，並且可以產生
比pydoc要豐富的API文件。這在python 2.6以後的文件中成為邏輯結構標準。

她其實是rst的語法，但python文件小組利用rst的directive上多了定義了一些東西成
為sphinx.  並且利用docutils的工具又往上多寫了document generator, 
sphinx-build.

例如在原本的.rst檔案內

::

  .. py:function:: enumerate(sequence[, start=0])

     Return an iterator that yields tuples of an index and an item of the
      *sequence*. (And so on.)

但是在sphinx的工具下面， 因為他多了py:，展現的就不只是單純的文字，而是
enumerate會有粗體效果等等。

現在整個計畫變成跟doxygen類似，開始支援其他語言像C/C++,javascript等。她把這個
支援稱為domain，不同的語言視為不同domain。

線上有個免費的 https://readthedocs.org 就是以sphinx來產生文件，所以後端文件格
式其實就是 rst 格式，只是前面產生的 GUI 效果有段落章節搜尋等連結介面。由於
readthedocs 是opensource的，所以你也可以裝一個在自己公司內，變成自己公司的
文件產生與閱讀site。

準備
^^^^

debian套件
  * python-sphinx
網頁文件
  * http://sphinx-doc.org/contents.html

tag參考
  * http://www.sphinx-doc.org/en/master/rest.html
  * http://sphinx-doc.org/domains.html

Example
^^^^^^^

::

  .. py:function:: enumerate(sequence[, start=0])

     Return an iterator that yields tuples of an index and an item of the
      *sequence*. (And so on.)

說明與注意事項

轉換產出
^^^^^^^^

::

  $ sphinx-build -b html src doc/html
  $ sphinx-build -b latex src doc/latex

========
文件版權
========

在 opensource community 中有眾多的版權聲明，知識工作者的產出無非就是文件，
在 Linux Foundation 的一個計畫就是 System Package Data Exchange (SPDX)
規範了 software BOM 表， BOM, Bill of Materials 是表示生產時所需的所有零件
列表，軟體一樣有產出列表，包含了 readme, license, changelog ...版本，
copyrights 等等。SPDX 列出所有 license 的 ID 字串，希望大家在文件前能簡單
使用這些標準字串。

::

  // SPDX-License-Identifier: MIT
  /* SPDX-License-Identifier: MIT OR Apache-2.0 */
  # SPDX-License-Identifier: GPL-2.0-or-later

參考
  * https://spdx.org/licenses/

====
結語
====

其實了解了重點後，抓到了所有結構的分層要點，就知道了大致上文件系統的面貌了。
自己要對自己的文件寫作格式有一定的規定，例如header 用 ====，indentation是
空兩格，四格，或者tab鍵，等等大家或自己的習慣。反正文件就那幾樣，README
,API, USER GUIDE, LICENSE, Presentation....把這些分門別類想清楚，然後制定空格
，空白起始行等等自我規定做成template以後就有寫作的遵循規範。以我自己而言，
公司對外的使用手冊，技術手冊有專業的tech writer負責，那種就需要像docbook, latex
複雜的tag每個都要了解很仔細，公司也有公司對外統一的規定，我也不用寫那種東西，我
的面向就是README, LICENSE, API文件，Design文件，這樣的文件雖然也有規定，但不是那
麼嚴謹龜毛，我使用的文件邏輯元素就固定那一些表達清楚就夠了。

不用懷疑了，丟掉笨重的GUI office，開始用vim+tools就可快速產生圖文並茂並且真正專
業的文件與簡報。
