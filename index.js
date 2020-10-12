const fs = require('fs-extra');
const path = require('path');
const frontmatter = require('@github-docs/frontmatter');
const uniq = require('lodash.uniq');
const slugify = require('slugify');
const slug = (s) => slugify(s, { lower: true });

const sourcePath = '/Users/vgeorge/dev/safetag/content-backup/en';
const targetPath = path.join(__dirname, 'content');
const targetActivitiesPath = path.join(targetPath, 'activities');
const targetMethodsPath = path.join(targetPath, 'methods');
const targetReferencesPath = path.join(targetPath, 'references');

let activitiesTitles = [];
let referencesTitles = [];
let authors = [];
let approaches = [];
let remoteOptions = [];
let skills = [];
let infos = [];
let organizationSizeUnder = [];

const fixArrayField = (field) => {
  return (field || []).reduce((acc, a) => {
    return acc
      .concat(a.split(','))
      .map((a) => a.trim())
      .filter((a) => !['unknown', 'N/A'].includes(a));
  }, []);
};

const fixNumericField = (value) => {
  let result = value;

  // If array, get value in first cell, ignore the rest
  if (Array.isArray(value)) result = value[0];

  if (['unknown', 'N/A'].includes(result)) return null;

  return parseInt(result);
};

async function parseActivities() {
  await fs.ensureDir(targetActivitiesPath);

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

    function parseSection(title) {
      let section = [],
        sectionStart = 99999999,
        sectionLevel;
      for (let l = 0; l < content.length; l++) {
        const line = content[l];

        // Find section start
        if (line.indexOf(`#### ${title}`) > -1) {
          sectionStart = l;
          sectionLevel = line.split(' ')[0]; // get current level as markup
          continue; // skip line
        }

        // If line is after section start
        if (sectionStart && sectionStart <= l) {
          // Stop if line starts a new section
          if (line.startsWith(`${sectionLevel} `)) break;

          // Collect line
          section.push(line);
        }
      }
      return section.join('\n');
    }

    // Keep slug/title to add the relationship to methods
    activitiesTitles.push({
      slug: exercise,
      title,
    });

    const output = {
      title,
      approaches: fixArrayField(data['Approach']),
      authors: fixArrayField(data['Authors']),
      remote_options: fixArrayField(data['Remote_options']),
      skills_required: fixArrayField(data['Skills_required']),
      skills_trained: fixArrayField(data['Skills_trained']),
      summary: parseSection('Summary'),
      overview: parseSection('Overview'),
      materials_needed: parseSection('Materials Needed'),
      considerations: parseSection('Considerations'),
      walk_through: parseSection('Walkthrough'),
      recommendations: parseSection('Recommendation'),
    };

    // Fix numeric fields
    const organization_size_under = fixNumericField(data['Org_size_under']);
    if (Number.isInteger(organization_size_under))
      output.organization_size_under = organization_size_under;

    const time_required_minutes = fixNumericField(
      data['Time_required_minutes']
    );
    if (Number.isInteger(time_required_minutes))
      output.time_required_minutes = time_required_minutes;

    // Write file
    const outputFilePath = path.join(targetActivitiesPath, `${exercise}.md`);
    await fs.writeFile(
      outputFilePath,
      frontmatter.stringify('', output),
      'utf-8'
    );

    authors = authors.concat(output.authors);
    approaches = approaches.concat(output.approaches);
    remoteOptions = remoteOptions.concat(output.remote_options);
    skills = skills
      .concat(output.skills_required)
      .concat(output.skills_trained);
    if (output.organization_size_under) {
      organizationSizeUnder = organizationSizeUnder.concat(
        output.organization_size_under
      );
    }
  }
}

async function parseReferences() {
  await fs.ensureDir(targetReferencesPath);

  const referencesPath = path.join(sourcePath, 'references');
  const references = await fs.readdir(referencesPath);

  for (let i = 0; i < references.length; i++) {
    const reference = references[i];
    const output = {};

    // Ignore overview files
    if (reference.indexOf('overview') > -1) continue;

    const fileContent = await fs.readFile(
      path.join(referencesPath, reference),
      'utf-8'
    );

    const { data, content: body } = frontmatter(fileContent);

    let content = body.split('\n');

    // Get title
    let title = reference.replace('.md', ''); // set filename as default title
    for (let l = 0; l < content.length; l++) {
      const line = content[l];

      if (line.indexOf('####') > -1) {
        title = line.replace('####', '').replace('\n', '').trim();
        content = content.slice(l + 1); // remove title from body
        break;
      }
    }

    const outputFilePath = path.join(targetReferencesPath, reference);

    await fs.writeFile(
      outputFilePath,
      frontmatter.stringify(content.join('\n'), { title }),
      'utf-8'
    );

    referencesTitles.push({ slug: reference.replace('.md', ''), title });
  }
}

async function parseMethods() {
  await fs.ensureDir(targetMethodsPath);

  const methodsPath = path.join(sourcePath, 'methods');
  const methods = await fs.readdir(methodsPath);

  // Process methods
  for (let i = 0; i < methods.length; i++) {
    const method = methods[i];
    const output = {};

    const methodPath = path.join(methodsPath, method);

    // If not a directory, skip
    const fileStats = await fs.stat(methodPath);
    if (fileStats.isFile()) continue;

    // Add related activities
    const activitiesFile = path.join(methodPath, 'activities.md');
    const hasActivities = await fs.exists(activitiesFile);
    if (hasActivities) {
      let activitiesContent = await fs.readFile(activitiesFile, 'utf-8');

      // Extract activity ids
      output.activities = activitiesContent
        .split('\n')
        .filter((l) => l.indexOf('!INCLUDE') > -1) // get lines with includes
        .map((l) => l.split('exercises/')[1]) // discard text before slug
        .map((l) => l.split('/')[0]) // get slug, if directory
        .map((l) => l.split('.md')[0]) // get slug, if .md file
        .map((l) => activitiesTitles.find((a) => a.slug === l).title);
    }

    // Get Metadata
    const metadataFilePath = `${methodPath}.guide.md`;
    const metadataFileContent = await fs.readFile(metadataFilePath, 'utf-8');

    const { data, content } = frontmatter(metadataFileContent);

    output.authors = fixArrayField(data.Authors);
    output.info_provided = fixArrayField(data.Info_provided);
    output.info_required = fixArrayField(data.Info_required);

    // Get References
    output.references = content
      .split('\n')
      .filter((l) => l.indexOf('/references/') > -1)
      .map((l) => l.split('/references/')[1])
      .map((l) => l.replace('.md"', ''))
      .map((l) => referencesTitles.find((r) => r.slug === l).title);

    // Get title
    const body = content.split('\n');
    for (let l = 0; l < body.length; l++) {
      const line = body[l];

      if (line.indexOf('##') > -1) {
        output.title = line.replace('##', '').replace('\n', '').trim();
        break;
      }
    }

    // Parse section files
    const sections = [
      'summary',
      'purpose',
      'guiding_questions',
      'output',
      'operational_security',
      'preparation',
    ];

    // Get sections
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionFilePath = path.join(methodPath, `${section}.md`);

      if (!(await fs.exists(sectionFilePath))) continue;

      const sectionContent = await fs.readFile(sectionFilePath, 'utf-8');
      output[section] = sectionContent;
    }

    // Rename output to outputs
    output['outputs'] = output['output']
    delete output['output']

    // Add empty "the_flow_of_information"
    output['the_flow_of_information'] = ''

    const outputFilePath = path.join(targetMethodsPath, `${method}.md`);

    await fs.writeFile(
      outputFilePath,
      frontmatter.stringify('', output),
      'utf-8'
    );

    authors = authors = authors.concat(output.authors);
    infos = infos = infos
      .concat(output.info_required)
      .concat(output.info_provided);
  }
}

async function writeCategories(categories, categoryDirname, typeCheck) {
  const targetCategoriesPath = path.join(targetPath, categoryDirname);
  categories = uniq(categories);

  await fs.ensureDir(targetCategoriesPath);

  for (let i = 0; i < categories.length; i++) {
    const title = categories[i];

    // Ignore categories that do not match type, useful for parsing
    // numeric properties.
    if (typeCheck && !typeCheck(title)) continue;

    const titleSlug = slug(
      typeof title !== 'string' ? title.toString() : title
    );

    await fs.writeFile(
      path.join(targetCategoriesPath, `${titleSlug}.md`),
      frontmatter.stringify('', { title }),
      'utf-8'
    );
  }
}

async function main() {
  await parseActivities();
  await parseReferences();
  await parseMethods();
  await writeCategories(authors, 'authors');
  await writeCategories(approaches, 'approaches');
  await writeCategories(remoteOptions, 'remote-options');
  await writeCategories(skills, 'skills');
  await writeCategories(infos, 'infos');
  await writeCategories(
    organizationSizeUnder,
    'organization-size-under',
    Number.isInteger
  );
}

main();
