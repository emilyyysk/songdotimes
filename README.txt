SONGDO TIMES — how to publish to www.songdotimes.com

This folder is the complete website. Upload the WHOLE folder (index.html must be at the top level).

OPTION A — Netlify (easiest, free)
1. Go to app.netlify.com/drop and drag this folder onto the page.
2. Site settings > Domain management > Add custom domain > www.songdotimes.com
3. At your domain registrar (where you bought songdotimes.com), add DNS records Netlify shows you, usually:
   CNAME   www   ->   <your-site-name>.netlify.app
   (and redirect the bare songdotimes.com to www)
4. HTTPS turns on automatically within ~1 hour.

OPTION B — GitHub Pages (free)
1. Create a repository, upload all files in this folder.
2. Settings > Pages > Deploy from branch "main" / root.
3. The CNAME file is already included (www.songdotimes.com).
4. At your registrar add:  CNAME  www  ->  <your-github-username>.github.io

PUBLISHING A NEW MONTHLY ISSUE
Edit data.js only:
 - Add the new issue at the TOP of ISSUES (id "YYYY-MM", month, year, no, theme, note).
 - Add its articles to ARTICLES with issue: "YYYY-MM" and put photos in /images.
The home page cover automatically switches to the newest issue; older issues move to the Archive.
Then re-upload the folder (Netlify: drag again / GitHub: commit).
