#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import sys
sys.path.append("./handlers")
sys.path.append("./templates")
sys.path.append("./db")
sys.path.append("./mako")
sys.path.append("./markupsafe")   

from handlers.signup import *
from mako.template import Template


import webapp2

class CreateListHandler(webapp2.RequestHandler):
	def get(self):
		template = self.load_template()
		self.response.out.write(template)
	
	def load_template(self):
		template = Template(filename='./templates/createlist.html')
		return template.render()

class MainHandler(webapp2.RequestHandler):
	def get(self):
		template = self.load_template()
		self.response.out.write(template)
	
	def load_template(self):
		template = Template(filename='./templates/boozewheel.html')
		return template.render()
    	

                              
PAGE_RE = r'(/(?:[a-zA-Z0-9_-]+/?)*)'
app = webapp2.WSGIApplication([('/signup', SignUpHandler),
                               ('/login', LoginHandler),
                               ('/logout', LogoutHandler),  
                               ('/createlist', CreateListHandler),                                                       
                               ('/', MainHandler),
                               ],
                              debug=True)

