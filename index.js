const fs = require('fs-extra');
const path = require('path');
const frontmatter = require('@github-docs/frontmatter');

const sourcePath = '/Users/vgeorge/dev/safetag/content-backup/en';
const targetPath = path.join(__dirname, 'content');
const activitiesPath = path.join(targetPath, 'activities');

async function main() {
  await fs.ensureDir(targetPath);
  await fs.ensureDir(activitiesPath);

  const exercisesPath = path.join(sourcePath, 'exercises');
  const exercises = await fs.readdir(exercisesPath);

  // Process exercises
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];

    const sourcePath = path.join(exercisesPath, exercise);

    // If not a directory, skip
    const fileStats = await fs.stat(sourcePath);
    if (!fileStats.isDirectory()) continue;

    const fileContent = await fs.readFile(
      path.join(exercisesPath, exercise, 'index.md'),
      'utf-8'
    );

    const { data, content: body } = frontmatter(fileContent);

    const content = body.split('\n');

    // Get title
    let title;
    for (let l = 0; l < content.length; l++) {
      const line = content[l];

      if (line.indexOf('####') > -1) {
        title = line.replace('####', '').replace('\n', '').trim();
        break;
      }
    }

    function parseSection (title) {
      let section = [],
      sectionStart = 99999999;
      for (let l = 0; l < content.length; l++) {
        const line = content[l];

        // Find section start
        if (line.indexOf(`#### ${title}`) > -1) {
          sectionStart = l;
          continue; // skip line
        }

        // If line is after section start
        if (sectionStart && sectionStart <= l) {
          // Stop if line starts a new section
          if (line.indexOf('####') > -1) break;

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
   
    const output = frontmatter.stringify('', {
      // ...data,
      title,
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
    });

    const outputFilePath = path.join(activitiesPath, `${exercise}.md`);

    await fs.writeFile(outputFilePath, output, 'utf-8');
  }
}

main();
