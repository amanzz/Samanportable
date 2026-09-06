#!/usr/bin/env python3
"""SCH-02: record the status code each approved Container Houses destination answers.

The build ticket rules that the Explore the Range panel and You may also like are
resolved AT BUILD TIME from the approved set, with every destination confirmed 200.
This script is the confirmation, and scripts/sch02-generate-page-data.py renders only
the entries it records as 200 - so a sibling that goes live later joins the panel by
re-running these two scripts, and one that is not live yet can never be padded in.

Usage:
    python scripts/sch02-probe-link-status.py                       # production
    python scripts/sch02-probe-link-status.py http://127.0.0.1:3210 # local build
"""
import datetime
import json
import os
import sys
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH = "/product/container-houses"
APPROVED = [
    CH,
    CH + "/container-farmhouse",
    CH + "/expandable-container-house",
    CH + "/flat-pack-container-homes",
    CH + "/luxury-container-houses",
    CH + "/prefab-container-homes",
    CH + "/shipping-container-homes",
    CH + "/tiny-container-homes",
]


class NoRedirect(urllib.request.HTTPRedirectHandler):
    """A 301 is not a 200. Record the redirect instead of following it."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def main():
    base = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "https://www.samanportable.com"
    opener = urllib.request.build_opener(NoRedirect)
    results = {}
    for path in APPROVED:
        req = urllib.request.Request(base + path, method="GET",
                                     headers={"User-Agent": "SCH-02-build-check"})
        try:
            r = opener.open(req, timeout=60)
            results[path] = {"status": r.status, "location": None}
        except urllib.error.HTTPError as e:
            results[path] = {"status": e.code, "location": e.headers.get("Location")}
        except Exception as e:  # noqa: BLE001 - recorded, not swallowed
            results[path] = {"status": None, "error": repr(e)[:160]}
        row = results[path]
        print("%-5s %-58s %s" % (row.get("status"), path,
                                 row.get("location") or row.get("error") or ""))

    out = {
        "_note": "Status each approved Container Houses destination answered at build "
                 "time. Redirects are NOT followed: a 301 is not a 200.",
        "base": base,
        "probed": datetime.datetime.now().isoformat(timespec="seconds"),
        "results": results,
    }
    dest = os.path.join(REPO, "scripts", "sch02-link-status.json")
    with open(dest, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(out, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    print("\nwrote", dest)
    print("renderable (200, this page excluded): %d"
          % sum(1 for p, r in results.items()
                if r.get("status") == 200 and not p.endswith("/shipping-container-homes")))


if __name__ == "__main__":
    main()
