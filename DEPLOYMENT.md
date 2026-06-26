# Deploy phosfox.us with private S3 + CloudFront

This setup serves a static site through CloudFront while keeping the S3 bucket
private. Cloudflare stays your registrar/DNS provider.

The site does **not** use S3 static website hosting. CloudFront accesses the
ordinary S3 bucket endpoint through Origin Access Control (OAC).

## What you will create

```text
phosfox.us
  └─ Cloudflare DNS
       └─ CloudFront distribution
            └─ Origin Access Control
                 └─ private S3 bucket
```

Use a bucket name that is globally unique. The examples below use:

```text
phosfox-us-site-REPLACE-WITH-RANDOM
```

Use `us-east-1` for this whole setup. CloudFront certificates must be in
`us-east-1`, and keeping the bucket there avoids needless cross-region
complexity for a small site.

---

## 1. Put the site in a Git repository

From the directory containing this README:

```bash
git init
git branch -M main
git add index.html assets README.md DEPLOYMENT.md
git commit -m "Initial phosfox.us site"
```

Create an empty GitHub repository through the GitHub web UI, then connect it:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/phosfox-site.git
git push -u origin main
```

For future edits:

```bash
git status
git add index.html assets
git commit -m "Describe the site change"
git push
```

Do not commit AWS access keys, Cloudflare API tokens, or `.env` files.

---

## 2. Create the S3 bucket

In AWS Console:

1. Switch to **us-east-1 (N. Virginia)**.
2. Open **S3** → **Create bucket**.
3. Bucket name: `phosfox-us-site-REPLACE-WITH-RANDOM`.
4. Keep **Block all public access** enabled.
5. Keep Object Ownership as **Bucket owner enforced**.
6. Create the bucket.

Do not enable **Static website hosting**. Do not make the bucket public.

---

## 3. Request the TLS certificate

1. In **us-east-1**, open **AWS Certificate Manager**.
2. Request a public certificate.
3. Domain name: `phosfox.us`.
4. Validation method: **DNS validation**.
5. Request the certificate.
6. ACM gives you a CNAME record. In Cloudflare DNS, create that exact CNAME
   record with **DNS only** mode.
7. Wait until ACM shows **Issued**.

Do not continue until the certificate is issued.

You can add `www.phosfox.us` later, but then request a new certificate that
includes it and add it to CloudFront's Alternate domain names. Keep the first
deployment to the apex domain only.

---

## 4. Create a CloudFront distribution and OAC

1. Open **CloudFront** → **Create distribution**.
2. Under Origin:
   - Origin domain: select the S3 bucket's normal origin. It should look like
     `phosfox-us-site-REPLACE-WITH-RANDOM.s3.us-east-1.amazonaws.com`.
   - Do **not** select an S3 website endpoint.
3. Origin access:
   - choose **Origin access control settings (recommended)**;
   - create a new OAC if prompted;
   - signing behavior: **Sign requests**.
4. Default cache behavior:
   - Viewer protocol policy: **Redirect HTTP to HTTPS**.
   - Allowed HTTP methods: GET, HEAD.
5. Settings:
   - Default root object: `index.html`.
   - Alternate domain name: `phosfox.us`.
   - Custom SSL certificate: choose the ACM certificate from step 3.
6. Create the distribution.

CloudFront will offer to update the S3 bucket policy. Accept the generated
policy. It should allow `s3:GetObject` only for the CloudFront distribution
through its OAC.

Wait for the distribution status to become **Enabled**. Copy its domain name,
which looks like:

```text
d123exampleabc.cloudfront.net
```

---

## 5. Point Cloudflare DNS at CloudFront

In Cloudflare → your `phosfox.us` zone → **DNS**:

1. Add a CNAME record:
   - Name: `@`
   - Target: `d123exampleabc.cloudfront.net`
   - Proxy status: **DNS only** (gray cloud)
2. Cloudflare automatically flattens this apex CNAME for DNS clients.

Wait for DNS to propagate. Then open:

```text
https://phosfox.us
```

If CloudFront returns an error before files are uploaded, that is expected.

---

## 6. Configure the AWS CLI locally

Install AWS CLI v2, then create an IAM user or role with permissions limited to
this portfolio bucket and the one CloudFront distribution. Configure it:

```bash
aws configure
```

Use the region:

```text
us-east-1
```

For the first deployment, define these shell variables:

```bash
export BUCKET="phosfox-us-site-REPLACE-WITH-RANDOM"
export DISTRIBUTION_ID="REPLACE_WITH_CLOUDFRONT_DISTRIBUTION_ID"
```

---

## 7. Deploy the files

From the site directory:

```bash
aws s3 sync . "s3://$BUCKET" \
  --exclude ".git/*" \
  --exclude ".DS_Store" \
  --exclude "README.md" \
  --exclude "DEPLOYMENT.md" \
  --cache-control "public, max-age=86400"
```

Then give `index.html` a short cache lifetime:

```bash
aws s3 cp index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"
```

Invalidate CloudFront after every deployment:

```bash
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*"
```

At this traffic level, a full invalidation is simple and inexpensive.

---

## 8. Future deploys

```bash
git status
git add index.html assets
git commit -m "Update portfolio copy"
git push

aws s3 sync . "s3://$BUCKET" \
  --delete \
  --exclude ".git/*" \
  --exclude ".DS_Store" \
  --exclude "README.md" \
  --exclude "DEPLOYMENT.md" \
  --cache-control "public, max-age=86400"

aws s3 cp index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*"
```

`--delete` removes files from S3 that no longer exist locally. Check the
directory before using it.

---

## Verification checklist

```bash
curl -I https://phosfox.us
```

You want:

- an HTTPS response;
- a 200 status for `/`;
- `server: CloudFront` or CloudFront response headers;
- no public S3 bucket policy granting everyone access.

Also verify:

- `http://phosfox.us` redirects to HTTPS;
- the password generator works without network requests;
- AlmostBear and Operand project links open;
- mobile layout works;
- Cloudflare DNS record remains **DNS only** until you deliberately decide to
  add Cloudflare proxying in front of CloudFront.

## AWS reference pages

- CloudFront + private S3 with OAC:
  https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
- CloudFront custom domain / ACM requirements:
  https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html
- Default root object:
  https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html
