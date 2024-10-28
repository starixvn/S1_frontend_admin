# 終端機輸入 sh corepull.sh 即可執行
# 用途: 一次 pull 多個 branch
# 最後會返回到 develop branch

branches=("master" "develop" "stage" "release")

# 定義顏色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 沒有顏色

for branch in "${branches[@]}"; do
  echo "${BLUE}Switching to branch $branch${NC}"
  git checkout $branch
  echo "${YELLOW}Pulling latest changes for $branch${NC}"
  git pull origin $branch
  echo "${RED}---------------------------------${NC}"
done

git checkout develop
echo "${GREEN}(◍˃̶ᗜ˂̶◍) ✨ 更新成功!!! ✨ 目前回到 develop branch ✨(◍˃̶ᗜ˂̶◍) ${NC}"


