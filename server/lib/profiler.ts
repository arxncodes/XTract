import { GenerateWordlistRequest } from "@shared/schema";

export function generateWordlist(options: GenerateWordlistRequest): string[] {
  const {
    firstName, lastName, dob, petName, partnerName, partnerDob,
    fatherName, fatherDob, motherName, motherDob,
    siblingNames, siblingDobs, company,
    favHobby, favPerson, favInfluencer,
    keywords, useLeet, minLen, maxLen
  } = options;

  const baseWords: string[] = [];
  const inputs = [
    firstName, lastName, dob, petName, 
    partnerName, partnerDob,
    fatherName, fatherDob,
    motherName, motherDob,
    company, favHobby, favPerson, favInfluencer
  ];
  
  // Add basic inputs
  inputs.forEach(w => {
    if (w && w.trim().length > 0) baseWords.push(w.trim());
  });

  // Add comma separated fields (siblings, keywords)
  [siblingNames, siblingDobs, keywords].forEach(field => {
    if (field) {
      field.split(',').forEach(k => {
        const trimmed = k.trim();
        if (trimmed.length > 0) baseWords.push(trimmed);
      });
    }
  });

  // If no words, return empty
  if (baseWords.length === 0) return [];

  const wordSet = new Set<string>();

  // Helper: Add to set if length valid
  const add = (w: string) => {
    if (w.length >= minLen && w.length <= maxLen) {
      wordSet.add(w);
    }
  };

  // 1. Basic Transformations
  baseWords.forEach(word => {
    add(word);
    add(word.toLowerCase());
    add(word.toUpperCase());
    add(capitalize(word));
  });

  // 2. Leet Speak
  if (useLeet) {
    const currentWords = Array.from(wordSet); // Snapshot to avoid infinite loop
    currentWords.forEach(w => {
      const leet = toLeet(w);
      add(leet);
    });
  }

  // 3. Common Appendages / Combinations - MASSIVE EXPANSION
  // We need to generate ~5M passwords.
  
  const currentYear = new Date().getFullYear();
  const years = [];
  // Add years from 1900 to current + 10
  for (let y = 1900; y <= currentYear + 10; y++) years.push(y);
  // Add 2-digit years
  for (let y = 0; y <= 99; y++) years.push(String(y).padStart(2, '0'));
  
  const commonNumbers = [];
  // Add 0-999
  for (let n = 0; n <= 999; n++) commonNumbers.push(n);
  // Add common sequences
  commonNumbers.push(1234, 12345, 123456, 1234567, 12345678, 123456789, 1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888, 9999);
  
  const specialChars = ["!", "@", "#", "$", "%", "&", "*", "?", ".", "_", "-", "+", "=", "~"];
  const doubleSpecials = ["!!", "@@", "##", "$$", "??", "!@", "@!", "123!", "123456!", "123456789!"];
  
  const workingList = Array.from(wordSet);

  workingList.forEach(w => {
    // Suffixes
    years.forEach(y => {
      add(`${w}${y}`);
      specialChars.forEach(c => add(`${w}${y}${c}`));
    });
    
    commonNumbers.forEach(n => {
      add(`${w}${n}`);
      specialChars.forEach(c => add(`${w}${n}${c}`));
    });

    specialChars.forEach(c => {
      add(`${w}${c}`);
      add(`${c}${w}`);
      add(`${c}${w}${c}`);
      doubleSpecials.forEach(ds => add(`${w}${ds}`));
    });
  });

  // 4. Advanced Combinations (Word + Separator + Word)
  const separators = ["", ".", "_", "-", "@", "#", "!", "/"];
  const coreBaseWords = baseWords.slice(0, 30); 

  for (let i = 0; i < coreBaseWords.length; i++) {
    for (let j = 0; j < coreBaseWords.length; j++) {
      if (i !== j) {
        const w1 = coreBaseWords[i];
        const w2 = coreBaseWords[j];
        
        separators.forEach(sep => {
          const combined = `${w1}${sep}${w2}`;
          add(combined);
          
          // Add massive variants to combined forms
          years.slice(-50).forEach(y => add(`${combined}${y}`));
          specialChars.forEach(c => add(`${combined}${c}`));
          commonNumbers.slice(0, 100).forEach(n => add(`${combined}${n}`));
        });
        
        // Triple combinations (Word + Word + Word)
        for (let k = 0; k < Math.min(coreBaseWords.length, 10); k++) {
          if (k !== i && k !== j) {
            const w3 = coreBaseWords[k];
            add(`${w1}${w2}${w3}`);
            add(`${w1}.${w2}.${w3}`);
            // Append short year to triple
            add(`${w1}${w2}${w3}${String(currentYear).slice(2)}`);
          }
        }
      }
    }
  }
  
  // 5. Reverse & Advanced Case
  // Only for short words to avoid weird results
  baseWords.forEach(w => {
     const reversed = w.split('').reverse().join('');
     add(reversed);
     
     // Toggle Case (e.g. aRyAn) - simple version
     let toggled = "";
     for(let i=0; i<w.length; i++) {
       toggled += i % 2 === 0 ? w[i].toLowerCase() : w[i].toUpperCase();
     }
     add(toggled);
     
     let toggled2 = "";
     for(let i=0; i<w.length; i++) {
       toggled2 += i % 2 !== 0 ? w[i].toLowerCase() : w[i].toUpperCase();
     }
     add(toggled2);
  });

  return Array.from(wordSet);
}

function capitalize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function toLeet(s: string) {
  const map: Record<string, string> = {
    'a': '@', 'A': '@',
    'e': '3', 'E': '3',
    'i': '1', 'I': '1',
    'o': '0', 'O': '0',
    's': '$', 'S': '$',
    't': '7', 'T': '7'
  };
  return s.split('').map(c => map[c] || c).join('');
}
