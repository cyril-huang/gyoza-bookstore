# Copyright (C) 2001-2023  Cyril Huang, Gyoza Workshop 
# SPDX-License-Identifier: MIT OR Apache-2.0

#doc            := book
#CHAPTER        := chap1.tex chap2.tex chap3.tex

TARGET          := $(addsuffix .pdf,$(doc)) $(addsuffix .html,$(doc))
DEBUG           := $(TARGET:pdf=xdv)

TW_SUNG         := $(shell fc-list :lang=zh-tw | sed -n 's/.*tt[fc]: *\(TW.*\+Sung\),.*/\1/p' | sed 's|\\||g')
MOE_SUNG        := $(shell fc-list | sed -n 's/.*tt[fc]: *\([^,]\+\),教育部.*宋體.*/\1/p')
NOTO_SANS_TC    := $(shell fc-list :lang=zh-tw | sed -n 's/.*tt[fc]: *\(Noto Sans[^,]\+\).*/\1/p' | sort -u | head -n1)
NOTO_SERIF_TC   := $(shell fc-list :lang=zh-tw | sed -n 's/.*tt[fc]: *\(Noto Serif[^,]\+\).*/\1/p' | sort -u | head -n1)

ifeq ($(font),)
ifneq ($(TW_SUNG),)
font	:= $(TW_SUNG)
else ifneq ($(MOE_SUNG),)
font	:= $(MOE_SUNG)
else ifneq ($(NOTO_SERIF_TC),)
font	:= $(NOTO_SERIF_TC)
else ifneq ($(NOTO_SANS_TC),)
font	:= $(NOTO_SANS_TC)
else
$(error No font found)
endif
endif

default: $(TARGET)
debug: $(DEBUG)

%.pdf: %.tex $(CHAPTER)
	cp -av $< m$<
	if ! sed -n '0,/begin{document}/p' m$< | grep 'usepackage{xeCJK}'; then \
		sed -i '0,/documentclass/s/\(documentclass.*\)/\1\n\\usepackage{xeCJK}/' m$<; \
	fi
	if ! sed -n '0,/begin{document}/p' m$< | grep 'setCJKmainfont{.*}'; then \
		sed -i '0,/usepackage{xeCJK}/s/\(usepackage{xeCJK}.*\)/\1\n\\setCJKmainfont{$(font)}/' m$<; \
	else \
		sed -i '0,/setCJKmainfont/s|.*setCJKmainfont.*|\\setCJKmainfont{$(font)}|' m$<; \
	fi
	xelatex m$< ;  [ -f m$*.idx ] && makeindex m$*.idx; xelatex m$<
	mv m$*.pdf $@
	rm -f m$<

%.html: %.tex
	-@if which htlatex; then \
		htlatex $< "xhtml,html5,mathml,charset=utf-8" -cunihtf -utf8; \
	elif which make4ht; then \
		make4ht $< $@; \
	elif which late2html; then \
		latex2html $< > $@; \
	elif which rst2html5; then \
		if [ -f $*.rst ]; then \
			rst2html5 -r 5 --halt 5 $< > $@; \
		else \
			echo "No tool to generate html"; \
		fi; \
	fi

%.tex: %.rst
	which rst2xetex && rst2xetex $< > $@
	sed -i '0,/setmainfont/{/setmainfont/d}' $@
	sed -i '0,/setsansfont/{/setsansfont/d}' $@
	sed -i '0,/setmonofont/{/setmonofont/d}' $@

font:
	@echo $(font)

%.xdv: %.tex
	xelatex $<

clean:
	rm -f *.aux *.toc *.log *.out *.vrb *.nav *.snm *.ilg *.ind *.idx \
	*.dvi *xdv *.ps $(TARGET) $(DEBUG)
