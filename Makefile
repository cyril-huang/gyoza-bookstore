# Copyright (C) 2023 Gyoza Associate,Inc - All Rights Reserved
# GPLv3
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

SUBDIRS	= cisco-wireless latex-intro doc-intro scripts opentoolsv2

default:
	for subdir in $(SUBDIRS); do \
		$(MAKE) -C $$subdir; \
	done

clean:
	for subdir in $(SUBDIRS); do \
		$(MAKE) -C $$subdir $@; \
	done
	rm -f $(PDFDOC)

%.pdf:%.rst
	if which rst2pdf; then \
		rst2pdf $<; \
	fi

.PHONY: default clean
