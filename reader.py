file = open('orig_systems.txt')
stars = list()
for line in file:
    line = line.strip()
    line = line.split(',')
    star_id = int(line[0].strip('{id: '))
    x_coord = float(line[1].strip()[2:])
    y_coord = float(line[2].strip()[2:])
    z_coord = float(line[3].strip()[2:])
    system_name = line[4].strip('"')[10:]
    if system_name.__contains__('"'):
        system_name = system_name[1:]
    if line[5].__contains__('planetName'):
        planet_name = line[5].strip().strip('"').split('"')[1]
    else:
        planet_name = None
    star = list()
    star.append(star_id)
    star.append(x_coord)
    star.append(y_coord)
    star.append(z_coord)
    star.append(system_name)
    star.append(planet_name)
    stars.append(star)
file.close()


file = open('stars.txt', 'w')
for i in stars:
    if i[5] is not None:
        file.write('{:3d}    ({: .2f}, {: .2f}, {: .2f})    {:s} [{:s}]\n'.format(i[0], i[1], i[2], i[3], i[4], i[5]))
    else:
        file.write('{:3d}    ({: .2f}, {: .2f}, {: .2f})    {:s}\n'.format(i[0], i[1], i[2], i[3], i[4]))
file.close()
