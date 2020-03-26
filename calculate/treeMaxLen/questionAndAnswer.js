/**
 * 问题描述
 * 实现一个成语接龙算法：
 *   给定一组成语，找到一组接龙使成语的数目最多，接龙中每个成语只能使用一次。
 * 
 * 例如
 * 
 * 三生三世 世界和平 平白无故  平平无奇 奇思妙想 想入非非 非你莫属  故弄玄虚
 * 
 * 
 * 输出：
 * 
 * 三生三世 世界和平 平平无奇 奇思妙想 想入非非 非你莫属 
 * 
 * 
 * 
 * 解题思路：
 * 
 * 求树结构的最长路径。
 */



/**
 * 构建样本数据集与测试数据集
 */

// const testData = [[1,2],[5,3],[7,8],[2,5],[2,3],[3,3],[3,5],[8,4],[4,3],[3,1],[2,7]];
const testData = ["三生三世", "世界和平", "平白无故",  "平平无奇", "奇思妙想", "想入非非", "非你莫属",  "故弄玄虚"];

/**
  * 分析与思路
  * 在当前成语库中，构建所有可能的成语树结构，计算所有树中最大长度路径结构
  * [1,2]-{
  *   [2,5]-{
  *       [5,3]-{
  *           [cycle]
  *       }
  *   }
  *   [2,7]-{
  *       [7,8]-{
  *           [8,4]-{
  *               [4,3]-{
  *                   cycle
  *               }
  *           }
  *       }
  *   }
  *   [2,3]-{
  *       [3,5]-{
  *           [cycle]
  *       }
  *       [3,3]-{
  *           [cycle]
  *       }
  *       [3,1]-{
  *           [cycle]
  *       }
  *   }
  * }
  * 
  * 问题
  * 1.当前成语库中可构建的树不唯一
  * 2.当前成语库构建的单一树结构不唯一
  */

  function treeMaxPath(testData) {

    // 将原始数据节点化
    let nodes = testData.map(v=> {
        return {
            originV: v,
            startV: v[0],
            endV: v[v.length-1],
            children: []
        }
    });

    // 构建节点关系
    nodes.map(n=> {
        n.children = nodes.filter(cn=>cn.startV===n.endV);
    });

    let paths = []; // 路径集
    let maxLenPath = []; // 最长路径

    // 递归计算可能路径
    function calculate(nodePaths, childrenNodes) {

        if (childrenNodes.length==0) {
            paths.push(nodePaths);
        } else {
            childrenNodes.map(n=> {
                if (nodePaths.indexOf(n)==-1) {
                    let nps =nodePaths.concat([]);
                    nps.push(n);
                    calculate(nps, n.children);
                } else {
                    paths.push(nodePaths);
                }
            });
        }

    }

    calculate([], nodes);

    maxLenPath = paths.reduce((path, tempPath)=> {
        if (tempPath.length>path.length) {
            return tempPath;
        } else {
            return path;
        }
    }, []);

    return maxLenPath.map(v=>v.originV);
  }

 console.log(treeMaxPath(testData));

 /**
  * 可优化部分
  * 1，由原始样本转换成节点对象数据结构和最终的转换回原始样本数据结构这两次循环是不必要的
  * 只是在算法梳理时比较方便，最终算法优化时可优化掉
  * 2，递归计算树长度的时候，只需临时缓存当前最长树结构，无需将所有结构全部存储，最终在从全部结构中找出最长的那一个
  * 这在使用中也是没必要的，只是在梳理算法时可以使算法逻辑更清晰易懂
  * 3，循环树结构，有一些情况是树结构首尾相接，在运算时会分别计算所有种情况，而首尾相接的情况是重复的结构
  * 是可以优化掉这些不要的计算的
  */

/**
 * 简化版
 */

let maxLenPath = [];

function calculate(nodes, path) {
    nodes.map(v=> {
        let _path = path.concat([]);
        _path.push(v);
        let children = testData.filter(cv=>{
            return v[v.length-1]==cv[0] && _path.indexOf(cv)<0;
        });
        if (children.length===0) {
            if (_path.length>maxLenPath.length) {
                maxLenPath = _path;
            }
        } else {
            calculate(children, _path);

        }
    });
}
calculate(testData, [])
console.log(maxLenPath);