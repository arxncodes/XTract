import itertools
import sys
import os
import time

def print_header():
    print("=======================================")
    print("             XTRACT PROFILER           ")
    print("=======================================")
    print(" Developer: arxncodes (Aryan)          ")
    print(" Co-Dev / Tester: aashay               ")
    print(" Organisation: XCorp_                  ")
    print("=======================================\n")

def get_input():
    print("[*] Enter Target Details (Leave blank to skip)")
    data = {}
    
    # Core
    data['first_name'] = input("First Name: ").strip()
    data['last_name'] = input("Last Name: ").strip()
    data['dob'] = input("DOB (DDMMYYYY): ").strip()
    data['pet'] = input("Pet Name: ").strip()
    data['company'] = input("Company/School: ").strip()
    
    # Family
    print("\n[-] Family Intelligence")
    data['partner'] = input("Partner Name: ").strip()
    data['partner_dob'] = input("Partner DOB: ").strip()
    data['father'] = input("Father Name: ").strip()
    data['father_dob'] = input("Father DOB: ").strip()
    data['mother'] = input("Mother Name: ").strip()
    data['mother_dob'] = input("Mother DOB: ").strip()
    data['siblings'] = input("Sibling Names (comma sep): ").strip()
    data['siblings_dob'] = input("Sibling DOBs (comma sep): ").strip()

    # Interests
    print("\n[-] Interests & Favorites")
    data['hobby'] = input("Favorite Hobby: ").strip()
    data['person'] = input("Favorite Person: ").strip()
    data['influencer'] = input("Favorite Influencer: ").strip()

    # Extra
    keywords_raw = input("\nExtra Keywords (comma separated): ").strip()
    
    # Process comma separated fields immediately into list
    base_words = []
    
    # Helper to add split strings
    def add_csv(text):
        if text:
            for x in text.split(','):
                if x.strip(): base_words.append(x.strip())

    # Add single fields
    single_keys = ['first_name', 'last_name', 'dob', 'pet', 'company', 
                  'partner', 'partner_dob', 'father', 'father_dob', 
                  'mother', 'mother_dob', 'hobby', 'person', 'influencer']
                  
    for k in single_keys:
        if data[k]: base_words.append(data[k])

    # Add CSV fields
    add_csv(data['siblings'])
    add_csv(data['siblings_dob'])
    add_csv(keywords_raw)
    
    return base_words

def to_leet(text):
    replacements = {
        'a': '@', 'A': '@',
        'e': '3', 'E': '3',
        'i': '1', 'I': '1',
        'o': '0', 'O': '0',
        's': '$', 'S': '$',
        't': '7', 'T': '7'
    }
    return ''.join(replacements.get(c, c) for c in text)

def generate_variations(base_words, use_leet=False, min_len=6, max_len=20):
    variations = set()
    
    def add(w):
        if min_len <= len(w) <= max_len:
            variations.add(w)

    print("\n[*] Generating base variations...")
    
    # 1. Base cases
    for word in base_words:
        add(word)
        add(word.lower())
        add(word.upper())
        add(word.capitalize())
        
        if use_leet:
            add(to_leet(word))

    # 2. Combinations (Word + Word)
    print("[*] Generating combinations...")
    for w1, w2 in itertools.permutations(base_words, 2):
        combined = w1 + w2
        add(combined)
        add(w1 + "." + w2)
        add(w1 + "_" + w2)
        add(w1 + "@" + w2)

    # 3. Aggressive Affixes & Combinations
    current_year = 2026
    years = [str(y) for y in range(1900, current_year + 11)]
    years += [str(y).zfill(2) for y in range(100)]
    
    common_numbers = [str(n) for n in range(1000)]
    common_numbers += ["12345", "123456", "12345678", "123456789", "1111", "9999", "000"]
    
    special_chars = ["!", "@", "#", "$", "%", "&", "*", "?", ".", "_", "-", "+"]
    double_specials = ["!!", "@@", "123!", "321!", "007!", "123456!"]
    
    current_list = list(variations)
    print(f"[*] Applying massive affixation to {len(current_list)} base forms...")
    
    count = 0
    total = len(current_list)
    
    for w in current_list:
        count += 1
        if count % 100 == 0:
            sys.stdout.write(f"\rProgress: {count}/{total} base words processed")
            sys.stdout.flush()
            
        for y in years:
            add(w + y)
            for c in special_chars[:5]:
                add(w + y + c)
        
        for n in common_numbers:
            add(w + n)
            for c in special_chars[:3]:
                add(w + n + c)

        for c in special_chars:
            add(w + c)
            add(c + w)
            for ds in double_specials:
                add(w + ds)

    # 4. Advanced Combinations
    print("\n[*] Generating ultra-complex combinations...")
    separators = ["", ".", "_", "-", "@"]
    core_words = base_words[:30]

    for w1, w2 in itertools.permutations(core_words, 2):
        for sep in separators:
            combined = f"{w1}{sep}{w2}"
            add(combined)
            # Suffixes on dual combo
            for y in years[-30:]:
                add(combined + y)
            for c in special_chars[:5]:
                add(combined + c)
                
        # Triple Combinations
        for w3 in core_words[:10]:
            if w3 != w1 and w3 != w2:
                add(f"{w1}{w2}{w3}")
                add(f"{w1}.{w2}.{w3}")
                add(f"{w1}{w2}{w3}2026")

    # 5. Reverse & Patterns
    for w in base_words:
        add(w[::-1])
        # Alternating case
        add("".join([c.lower() if i % 2 == 0 else c.upper() for i, c in enumerate(w)]))
        add("".join([c.upper() if i % 2 == 0 else c.lower() for i, c in enumerate(w)]))

    print("\n")
    return list(variations)

def main():
    print_header()
    base_words = get_input()
            
    if not base_words:
        print("[-] No input provided. Exiting.")
        return

    print("\n--- Configuration ---")
    use_leet_in = input("Enable Leet Speak? (y/N): ").lower()
    use_leet = use_leet_in == 'y'
    
    try:
        min_len = int(input("Min Length (default 6): ") or 6)
        max_len = int(input("Max Length (default 20): ") or 20)
    except ValueError:
        min_len = 6
        max_len = 20

    print("\n[*] Starting generation engine...")
    wordlist = generate_variations(base_words, use_leet, min_len, max_len)
    
    filename = "wordlist.txt"
    print(f"[*] Writing {len(wordlist)} passwords to {filename}...")
    
    with open(filename, "w") as f:
        for w in wordlist:
            f.write(w + "\n")
            
    print(f"\n[+] Done! Saved to {os.path.abspath(filename)}")

if __name__ == "__main__":
    main()
