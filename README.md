# Claude Taiwan 社團精華展示櫃

精選 [Claude Taiwan](https://www.facebook.com/groups/1224997379198346) Facebook 社團的知識精華與社群活動分享。

**線上展示櫃** → https://Mapleeeeeeeeeee.github.io/digest-showcase/

## 用 CLI 閱讀文章

所有文章以 Markdown 存放在 `src/content/posts/`，可透過 GitHub CLI 直接存取。

### 列出所有文章

```bash
gh api repos/Mapleeeeeeeeeee/digest-showcase/contents/src/content/posts \
  --jq '.[] | .name'
```

### 讀取特定文章

```bash
gh api repos/Mapleeeeeeeeeee/digest-showcase/contents/src/content/posts/opus3-why-still-available.md \
  --jq '.content' | base64 -d
```

### 取得所有文章的 frontmatter（標題、作者、日期、分類）

```bash
for file in $(gh api repos/Mapleeeeeeeeeee/digest-showcase/contents/src/content/posts --jq '.[] | .name'); do
  echo "=== $file ==="
  gh api "repos/Mapleeeeeeeeeee/digest-showcase/contents/src/content/posts/$file" \
    --jq '.content' | base64 -d | sed -n '/^---$/,/^---$/p'
  echo
done
```

### Frontmatter 欄位

| 欄位 | 說明 |
|------|------|
| `title` | 文章標題 |
| `author` | 原始作者 |
| `date` | 發文日期 (ISO 8601) |
| `category` | `知識精華` 或 `社群活動` |
| `postType` | `article`（預設）、`discussion`（留言精華）、`qa`（常見問題） |
| `sourceUrl` | Facebook 原文連結 |
| `highlights` | 精選留言（僅 discussion/qa 類型），含 `author`、`text`、`likes`、`isBestAnswer` |
| `likes` / `comments` / `shares` | 互動數據 |
