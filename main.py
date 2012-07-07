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

from signup.signup import *
from wiki.newpage import *
from wiki.page import *

import webapp2
#from unit2.hw2q1.bhrot13 import *


class MainHandler(webapp2.RequestHandler):
    def get(self):    	
      	self.response.out.write("Hello, Udacity!")


                              
PAGE_RE = r'(/(?:[a-zA-Z0-9_-]+/?)*)'
app = webapp2.WSGIApplication([('/signup', SignUpHandler),
                               ('/login', LoginHandler),
                               ('/logout', LogoutHandler),
                               ('/_edit' + PAGE_RE, NewPageHandler),
                               ('/_history' + PAGE_RE, PageHistoryHandler),
                               (PAGE_RE, WikiPageHandler),
                               ('/', MainHandler),
                               ],
                              debug=True)

