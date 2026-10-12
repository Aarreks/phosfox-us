# Review the recent-project portfolio update

The version on this branch adds Keywulf and EffiGov Voice Desk (`agent-effi`) ahead
of the existing projects, links their code and verification evidence, and adds
Operand's room lifecycle evidence. Hero copy and the live-project list include
Keywulf. Existing assets, layout, themes and password generator are reused.

No service has been deployed by this change. Backend reliability work is on
separate review branches in `keywulf` and `operand`; their evidence links use those
branches so reviewers can inspect the proposed code before deployment. Keep the
branches available while those links are used, or change them to main after
merging the backend PRs. The portfolio does not assert that the new recovery code
is already running in production or that loopback latency measures internet latency.

## Local review

```sh
git switch review/recent-projects
python -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080 and check:

1. Keywulf and EffiGov appear first in Projects. Repository, runbook and demo
   links open the intended pages, with no broken links.
2. Keywulf describes immutable daily text, the 01:00 UTC clock boundary,
   metadata repairs and fresh-news-only recovery. It does not promise an outage
   can never delay release or claim that streak compensation was implemented.
3. EffiGov is labeled a local demo; staff control case status, AI analysis is
   separate, and voice quality requires a live call. There is no invented public
   deployment, production scale or municipal adoption claim.
4. Operand's evidence link opens its integration-test/load-measurement runbook.
5. Toggle Dark/Light, reload to check persistence, and check a narrow mobile
   viewport for readable project cards and links. Existing details panels and
   navigation anchors should still work.
6. Generate and copy a password. The browser should show no new network request
   from the generator and no console errors introduced by this copy change.

## Deploy later and undo

Review the diff, then merge when satisfied. There is no deployment workflow in
this repository; follow the existing `DEPLOYMENT.md` when ready to publish.
For this content-only update, uploading the reviewed `index.html` and invalidating
CloudFront is sufficient. `VERSION.txt` is only a version marker; assets are unchanged.

Before merging, close the PR to discard it. After merging, use
`git revert <merged-change-commit>`, preview again, upload the restored index and
invalidate CloudFront. No runtime storage or backend data needs changing.
