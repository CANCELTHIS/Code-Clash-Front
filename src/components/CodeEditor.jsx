import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import socketService from '../utils/socket';

const CodeEditor = ({ arenaId, userId, onCodeChange, challenge }) => {
  const getInitialCode = (lang) => {
    const templates = {
      javascript: `// ${challenge?.title || 'Challenge'}
// ${challenge?.description || 'Write your solution here'}

// Write your code below:

`,
      python: `# ${challenge?.title || 'Challenge'}
# ${challenge?.description || 'Write your solution here'}

# TODO: Implement your solution
# TODO: Handle edge cases  
# TODO: Test with sample inputs

def addNumbers(a, b):
    # Your code here
    return a + b

# Test your solution
print(addNumbers(2, 3))`,
      java: `// ${challenge?.title || 'Challenge'}
// ${challenge?.description || 'Write your solution here'}

public class Solution {
    // TODO: Implement your solution
    // TODO: Handle edge cases
    // TODO: Test with sample inputs
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test your solution
        System.out.println(sol.solve());
    }
    
    public int addNumbers(int a, int b) {
        // Your code here
        return a + b;
    }
}`,
      cpp: `// ${challenge?.title || 'Challenge'}
// ${challenge?.description || 'Write your solution here'}

#include <iostream>
#include <vector>
#include <string>
using namespace std;

// TODO: Implement your solution
// TODO: Handle edge cases
// TODO: Test with sample inputs

class Solution {
public:
    int addNumbers(int a, int b) {
        // Your code here
        return a + b;
    }
};

int main() {
    Solution sol;
    // Test your solution
    cout << sol.solve() << endl;
    return 0;
}`
    };
    return templates[lang] || templates.javascript;
  };

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(() => getInitialCode('javascript'));

  // Removed code synchronization - each user has their own editor

  const handleCodeChange = (value) => {
    setCode(value);
    if (onCodeChange) {
      onCodeChange(value, language);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    const newCode = getInitialCode(newLanguage);
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode, newLanguage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-primary text-secondary p-3 flex justify-between items-center">
        <h3 className="font-semibold">Code Editor</h3>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-accent text-primary px-3 py-1 rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;