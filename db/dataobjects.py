#!/usr/bin/env python

from google.appengine.ext import db
from google.appengine.api import memcache
from datetime import *
import webapp2
import logging
	
class User(db.Model):
	UserName = db.StringProperty(required=True)
	Password = db.StringProperty(required=True)
	Email = db.StringProperty(required=False)
	Salt = db.StringProperty(required=True)
	Create = db.DateTimeProperty(auto_now_add = True)
	