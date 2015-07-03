# https-hijack

Adds console logging to all https requests - provided the node module cache
isn't reset.

Useful for debugging libraries behind TLS/SSL

**Usage**: require anywhere to wrap the https standard library's request method
