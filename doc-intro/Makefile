# Copyright (C) 2014 Cyril Huang, Gyoza Workshop 

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

doc             := doc-intro
TARGET          := $(doc).pdf $(doc).html
TW_SUNG         := $(shell fc-list :lang=zh-tw | sed -n 's/.*ttf: *\(TW.*Sung\),.*/\1/p' | sed 's|\\||g')
MOE_SUNG        := $(shell fc-list | sed -n 's/.*ttf: *\([^,]\+\),教育部.*宋體.*/\1/p')
NOTO_SANS_TC    := $(shell fc-list :lang=zh-tw | sed -n 's/.*ttf: *\(Noto Sans[^,]\+\).*/\1/p' | sort -u | head -n1)
NOTO_SERIF_TC   := $(shell fc-list :lang=zh-tw | sed -n 's/.*ttf: *\(Noto Serif[^,]\+\).*/\1/p' | sort -u | head -n1)

ifneq ($(TW_SUNG),"")
font	:= $(TW_SUNG)
else ifneq ($(MOE_SUNG),"")
font	:= $(MOE_SUNG)
else ifneq ($(NOTO_SERIF_TC),"")
font	:= $(NOTO_SERIF_TC)
else ifneq ($(NOTO_SANS_TC),"")
font	:= $(NOTO_SANS_TC)
else
$(error No font found)
endif

all: $(TARGET) $(doc).rst

%.pdf: %.tex
	sed -i '/setmainfont/d' $<
	sed -i '/setsansfont/d' $<
	sed -i '/setmonofont/d' $<
	sed -i '1a\
\\usepackage{xeCJK}\
\\usepackage{fontspec}\
\\setCJKmainfont{$(font)}\
\\setCJKsansfont{$(font)}\
\\setCJKmonofont{$(font)}' $<
	xelatex $<
	xelatex $<

%.tex: %.rst
	rst2xetex $< > $@

%.html: %.rst
	-@which rst2html5 && rst2html5 $< > $@

clean:
	rm -f *.aux *.log *.toc $(doc).pdf $(doc).html *.dvi *.out *.tex
