# Copyright (C) 2001-2023  Cyril Huang, Gyoza Workshop 

# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

doc             := opentoolsv2
TARGET          := $(addsuffix .pdf,$(doc))
CHAPTER         := opentoolsv2.tex editor.tex srm.tex compiler.tex analyser.tex \
	           debug.tex build.tex devops.tex package.tex testing.tex
DEBUG           := $(TARGET:pdf=xdv)

TW_SUNG         := $(shell fc-list :lang=zh-tw | sed -n 's/.*ttf: *\(TW.*\+Sung\),.*/\1/p' | sed 's|\\||g')
MOE_SUNG        := $(shell fc-list | sed -n 's/.*ttf: *\([^,]\+\),教育部.*宋體.*/\1/p')
NOTO_SANS_TC    := $(shell fc-list :lang=zh-tw | sed -n 's/.*ttf: *\(Noto Sans[^,]\+\).*/\1/p' | sort -u | head -n1)
NOTO_SERIF_TC   := $(shell fc-list :lang=zh-tw | sed -n 's/.*ttf: *\(Noto Serif[^,]\+\).*/\1/p' | sort -u | head -n1)

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

default: $(TARGET)

debug: $(DEBUG)

%.pdf: %.tex $(CHAPTER)
	sed 's|.*setCJKmainfont.*|\\setCJKmainfont{$(font)}|' $< > m$<
	xelatex m$< ;  [ -f m$*.idx ] && makeindex m$*.idx; xelatex m$<
	mv m$*.pdf $@
	rm m$<

%.xdv: %.tex
	xelatex $<

clean:
	rm -f *.aux *.toc *.log *.out *.vrb *.nav *.snm *.ilg *.ind *.idx \
	*.dvi *xdv *.ps $(TARGET) $(DEBUG)
