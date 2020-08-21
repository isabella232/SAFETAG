const fs = require('fs-extra');
const path = require('path');
const frontmatter = require('@github-docs/frontmatter');

const sourcePath = '/home/yunica/safetag-backup/en';
const targetPath = path.join(__dirname, 'content');
const activitiesPath = path.join(targetPath, 'activities');
const methodsContentPath = path.join(targetPath, 'methods');

async function main() {
  await fs.ensureDir(targetPath);
  await fs.ensureDir(activitiesPath);
  await fs.ensureDir(methodsContentPath);

  const folders = [
    { name: 'exercises', headingTitle: '####', headingSection: '####', path: activitiesPath },
    { name: 'methods', headingTitle: '##', headingSection: '###', path: methodsContentPath }
  ]

  folders.forEach(async (j) => {
    const folderPath = path.join(sourcePath, j.name);
    const mdFiles = await fs.readdir(folderPath);
    // Process 
    for (let i = 0; i < mdFiles.length; i++) {
      const mdFile = mdFiles[i];
      const sourcePath = path.join(folderPath, mdFile);

      // If a directory, skip
      const fileStats = await fs.stat(sourcePath);
      if (fileStats.isDirectory()) continue;

      const fileContent = await fs.readFile(
        path.join(folderPath, mdFile),
        'utf-8'
      );

      const { data, content: body } = frontmatter(fileContent);

      // validate data has keys, safetag_audit_timeline.md
      if (Object.keys(data).length === 0 && data.constructor === Object) continue;

      const content = body.split('\n');

      // Get title
      let title;
      for (let l = 0; l < content.length; l++) {
        const line = content[l];

        if (line.indexOf(j.headingTitle) > -1) {
          title = line.replace(j.headingTitle, '').replace('\n', '').trim();
          break;
        }
      }

      function parseSection(title) {
        let section = [],
          sectionStart = 99999999;
        for (let l = 0; l < content.length; l++) {
          const line = content[l];

          // Find section start
          if (line.indexOf(`${j.headingSection} ${title}`) > -1) {
            sectionStart = l;
            continue; // skip line
          }

          // If line is after section start
          if (sectionStart && sectionStart <= l) {
            // Stop if line starts a new section
            if (line.indexOf(j.headingSection) > -1) break;

            // Collect line
            section.push(line);
          }
        }
        return section.join('\n')
      }

      const fixArrayField = (field) => {
        return (field || []).reduce((acc, a) => {
          return acc
            .concat(a.split(','))
            .map((a) => a.trim())
            .filter((a) => !['unknown', 'N/A'].includes(a));
        }, [])
      }
      let data_output;
      if (j.name === 'exercises') {

        data_output = {
          approaches: fixArrayField(data['Approach']),
          authors: fixArrayField(data['Authors']),
          remote_options: fixArrayField(data['Remote_options']),
          skills_required: fixArrayField(data['Skills_required']),
          skills_trained: fixArrayField(data['Skills_trained']),
          organization_size_under: data['Org_size_under'][0],
          time_required_minutes: data['Time_required_minutes'][0],
          summary: parseSection('Summary'),
          overview: parseSection('Overview'),
          materials_needed: parseSection('Materials Needed'),
          considerations: parseSection('Considerations'),
          walk_through: parseSection('Walkthrough'),
          recommendations: parseSection('Recommendations')
        };
      } else if (j.name === 'methods') {

        data_output = {
          activities: parseSection('Activities'),
          approaches: parseSection('Approach'),
          authors: fixArrayField(data['Authors']),
          guiding_questions: parseSection('Guiding Questions'),
          info_provided: fixArrayField(data['Info_provided']),
          info_required: fixArrayField(data['Info_required']),
          operational_security: parseSection('Operation Security'),
          outputs: parseSection('Outputs'),
          purpose: parseSection('Purpose'),
          preparation: parseSection('Preparation'),
          resources: parseSection('Resources'),
          summary: parseSection('Summary'),
          the_flow_of_information: parseSection('The Flow Of Information'),
        }
      }
      const output = frontmatter.stringify('', {
        // ...data,
        title,
        ...data_output
      }
      )

      const outputFilePath = path.join(j.path, mdFile);

      await fs.writeFile(outputFilePath, output, 'utf-8');
    }
  })
}

main();
