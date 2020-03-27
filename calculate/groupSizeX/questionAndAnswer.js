/**
 * 给定一副牌，每张牌上都写着一个整数。
 *
 *此时，你需要选定一个数字 X，使我们可以将整副牌按下述规则分成 1 组或更多组：
 *
 *每组都有 X 张牌。
 *组内所有的牌上都写着相同的整数。
 *仅当你可选的 X >= 2 时返回 true。
 *
 *来源：力扣（LeetCode）
 *链接：https://leetcode-cn.com/problems/x-of-a-kind-in-a-deck-of-cards
 *著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 */

/**
 * 示例
 * 输入：[1,2,3,4,4,3,2,1]
 * 输出：true
 * 解释：可行的分组是 [1,1]，[2,2]，[3,3]，[4,4]
 * 
 * 输入：[1]
 * 输出：false
 * 解释：没有满足要求的分组。
 * 
 * 输入：[1,1]
 * 输出：true
 * 解释：可行的分组是 [1,1]
 * 
 * 输入：[1,1,2,2,2,2]
 * 输出：true
 * 解释：可行的分组是 [1,1]，[2,2]，[2,2]
 */

 /**
  * 分析与思路
  * 
  * 1.计算出每个数字出现的次数
  * 2.对每个数字出现次数求最大公约数
  */

  /**
   * 解法
   */

  var hasGroupsSizeX = function(deck) {
    let k, values;
    let obj = {};

    // 计算每个数字出现次数
    deck.map(d=>{
        obj[d] = obj[d]=== undefined? 0: obj[d];
        obj[d]++;
    });

    // 求公约数方法
    function gcd(a, b) {
        if (a%b===0) return b;
        return arguments.callee(b, a%b);
    }

    // 求多个数字公约数方法
    function gcds(arry) {
        while(arry.length > 1) arry.splice(0, 2, gcd(arry[0], arry[1]));
        return arry[0];
    }

    values = Object.values(obj);

    k = gcds(values);
    return !!(k >= 2);
};