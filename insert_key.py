# Run this script in the same folder as index.html
# Usage: python insert_key.py

key = input("Paste your Supabase anon key: ").strip()

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

if 'PASTE_YOUR_ANON_KEY_HERE' in content:
    content = content.replace('PASTE_YOUR_ANON_KEY_HERE', key)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Done! Key inserted successfully.")
else:
    print("Placeholder not found. Key may already be set.")
